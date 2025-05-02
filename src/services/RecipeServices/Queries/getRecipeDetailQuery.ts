import { Request } from 'express';
import { ref, get, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { RecipeDetailResponseDto } from '../../../dtos/Recipes/recipe-detail.dto';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';
import { generateRecipeDetailPrompt } from '../../../utils/recipeDetailPromptGenerator';
import { formatPromptResponse } from '../../../utils/responseFormatter';

interface FirebaseRecipe {
  servicePromptResponse: string;
  [key: string]: any;
}

export class GetRecipeDetailQuery {
  private gptApiKey: string;
  private gptEndpoint: string;

  constructor() {
    this.gptApiKey = process.env.OPENAI_API_KEY || '';
    this.gptEndpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  async execute(req: Request): Promise<RecipeDetailResponseDto> {
    try {
      const recipeId = req.params.recipeId;
      const languageCode = req.query.languageCode as string || 'tr';

      // Firebase'de tarif var mı kontrol et
      const recipeRef = ref(database, `recipes/${recipeId}`);
      const recipeSnapshot = await get(recipeRef);

      if (recipeSnapshot.exists()) {
        const recipeData = recipeSnapshot.val();
        
        // Tarif verilerini düzenle ve yanıtı döndür
        return {
          success: true,
          data: recipeData,
          errorMessage: null
        };
      } else {
        // Firebase'de tarif bulunamadı, bu durumda tarif bilgilerini ChatGPT'den alalım
        // Önce recipe title ve type bilgisini almak için currentPrompts içinde arama yapalım
        const currentPromptsRef = ref(database, 'currentPrompts');
        const currentPromptsSnapshot = await get(currentPromptsRef);
        
        if (!currentPromptsSnapshot.exists()) {
          return {
            success: false,
            errorMessage: 'Recipe not found and no recipe data available'
          };
        }
        
        // recipeId'ye göre currentPrompts içindeki kayıtları kontrol et
        // recipeId, genellikle tarif başlığını ve türünü içeren bir string olmalı
        const allRecipes = Object.values(currentPromptsSnapshot.val()) as FirebaseRecipe[];
        let recipeTitle = '';
        let recipeType = '';
        let foundRecipeData = false;
        
        // currentPrompts içinde recipeId ile eşleşen bir başlık var mı kontrol et
        for (const recipe of allRecipes) {
          if (recipe.servicePromptResponse) {
            try {
              const parsedResponse = JSON.parse(recipe.servicePromptResponse);
              
              // recipeList veya menuList içinde arama yap
              const list = parsedResponse.recipeList || parsedResponse.menuList || [];
              
              for (const item of list) {
                // ID olarak kullanılabilecek normalize edilmiş başlık
                const normalizedTitle = item.title
                  .toLowerCase()
                  .replace(/\s+/g, '-') // boşlukları tire ile değiştir
                  .replace(/[^\w\-]+/g, '') // alfanumerik olmayan karakterleri kaldır
                  .replace(/\-\-+/g, '-') // çoklu tireleri tekli tireye dönüştür
                  .replace(/^-+/, '') // başlangıçtaki tireleri kaldır
                  .replace(/-+$/, ''); // sondaki tireleri kaldır
                
                if (normalizedTitle === recipeId) {
                  recipeTitle = item.title;
                  recipeType = item.type;
                  foundRecipeData = true;
                  break;
                }
              }
              
              if (foundRecipeData) break;
            } catch (error) {
              console.error('Error parsing servicePromptResponse:', error);
            }
          }
        }
        
        if (!foundRecipeData) {
          // Örnek bir başlık ve tür belirle, daha iyi bir çözüm bulunamadıysa
          recipeTitle = recipeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          recipeType = 'main course';
        }
        
        // Tarif detayını ChatGPT'den al
        const recipeDetailPrompt = generateRecipeDetailPrompt(languageCode, recipeTitle, recipeType);
        
        const response = await fetch(this.gptEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.gptApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: recipeDetailPrompt
              }
            ],
            max_tokens: 3000,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error from OpenAI API: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        if (!responseData.choices || responseData.choices.length === 0) {
          throw new Error('No response from OpenAI API');
        }
        
        const recipeDetailJson = responseData.choices[0].message.content;
        
        // Parse the response string into recipe detail object
        let recipeDetail;
        try {
          recipeDetail = JSON.parse(recipeDetailJson);
          
          // Unique ID atama
          recipeDetail.id = recipeId;
          recipeDetail.combinationId = uuidv4();
          recipeDetail.languageCode = languageCode;
          recipeDetail.createdAt = new Date().toISOString();
          
          // Firebase'e kaydet
          const newRecipeRef = ref(database, `recipes/${recipeId}`);
          await set(newRecipeRef, recipeDetail);
          
          // Yanıtı formatla
          const formattedResponse = formatPromptResponse(
            recipeDetail,
            {
              combinationId: recipeDetail.combinationId,
              promptServiceType: PromptServiceType.ChatGpt,
              promptType: 0, // Recipe tipi
              languageCode: languageCode,
              confirmedCount: 0,
              createdAt: recipeDetail.createdAt,
              id: recipeDetail.id
            }
          );
          
          return {
            success: true,
            data: formattedResponse,
            errorMessage: null
          };
        } catch (error) {
          console.error('Error parsing recipe detail:', error);
          return {
            success: false,
            errorMessage: `Failed to parse recipe detail: ${error instanceof Error ? error.message : 'Unexpected error'}`
          };
        }
      }
    } catch (error) {
      console.error('Error in GetRecipeDetailQuery:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
      };
    }
  }
} 