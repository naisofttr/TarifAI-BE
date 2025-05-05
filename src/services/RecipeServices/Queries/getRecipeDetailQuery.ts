import { Request } from 'express';
import { ref, get, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { RecipeDetailResponseDto } from '../../../dtos/Recipes/recipe-detail.dto';
import { formatPromptResponse } from '../../../utils/responseFormatter';
import { generateRecipeDetailPrompt } from '../../../utils/recipeDetailPromptGenerator';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import * as fs from 'fs';
import * as path from 'path';
import { storage } from '../../../config/firebase.config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GetRecipeImageByTypeQuery } from '../../RecipeImageServices/Queries/getRecipeImageByTypeQuery';

interface FirebaseRecipe {
  servicePromptResponse: string;
  [key: string]: any;
}

export class GetRecipeDetailQuery {
  private gptApiKey: string;
  private gptEndpoint: string;
  private imageEndpoint: string;

  constructor() {
    this.gptApiKey = process.env.OPENAI_API_KEY || '';
    this.gptEndpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    this.imageEndpoint = 'https://api.openai.com/v1/images/generations';
  }
  
  /**
   * Tarif için görsel oluşturur ve Firebase Storage'a kaydeder
   * @param recipeTitle Tarif başlığı
   * @param recipeType Tarif türü
   * @param recipeId Tarif ID'si
   * @param languageCode Dil kodu
   * @returns Görsel URL'i
   */
  private async generateAndSaveRecipeImage(recipeTitle: string, recipeType: string, recipeId: string, languageCode: string = 'tr'): Promise<string | null> {
    try {
      // API anahtarı yoksa, null döndür
      if (!this.gptApiKey) {
        console.error('OpenAI API anahtarı tanımlanmamış. Görsel oluşturulamadı.');
        return null;
      }
      
      // Görsel oluşturmak için prompt hazırla
      const imagePrompt = `A professional, appetizing photo of ${recipeTitle}, which is a ${recipeType} dish. The image should be high-quality, well-lit, and show the completed dish in a square composition that works well on mobile devices. Include garnishes, appropriate plating, and ensure the main dish is clearly visible and centered. The image should be optimized for mobile viewing with good contrast and clear details.`;
      
      // OpenAI API'sine istek gönder
      const response = await fetch(this.imageEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gptApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error from OpenAI Image API: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0 || !data.data[0].url) {
        throw new Error('No image URL in the response');
      }
      
      const imageUrl = data.data[0].url;
      
      // Görseli indirme
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Firebase Storage'a yükleme
      const imageFileName = `recipe_images/${recipeId}.jpg`;
      const imageRef = storageRef(storage, imageFileName);
      
      await uploadBytes(imageRef, new Uint8Array(imageBuffer));
      
      // Yüklenen görselin URL'ini alma
      const downloadUrl = await getDownloadURL(imageRef);
      
      return downloadUrl;
    } catch (error) {
      console.error('Error in generateAndSaveRecipeImage:', error);
      return null;
    }
  }

  async execute(req: Request): Promise<RecipeDetailResponseDto> {
    try {
      const recipeId = req.params.recipeId;
      const languageCode = req.query.languageCode as string || 'tr';
      
      // API anahtarı kontrolü
      if (!this.gptApiKey) {
        console.warn('OPENAI_API_KEY ortam değişkeni tanımlanmamış. ChatGPT özellikleri devre dışı.');
      }

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
                // Öncelikle item.id ile recipeId'yi karşılaştır
                if (item.id === recipeId) {
                  recipeTitle = item.title;
                  recipeType = item.type;
                  foundRecipeData = true;
                  break;
                }
                
                // Eğer id ile eşleşme yoksa, normalize edilmiş başlık ile dene (geriye dönük uyumluluk için)
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
        
        // API anahtarı yoksa, hata döndür
        if (!this.gptApiKey) {
          return {
            success: false,
            errorMessage: 'OpenAI API anahtarı tanımlanmamış. Tarif detayı alınamıyor.'
          };
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
            temperature: 0.7,
            response_format: { type: "json_object" }
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
          recipeDetail.languageCode = languageCode;
          recipeDetail.createdAt = new Date().toISOString();
          
          // Tarif görseli oluştur ve kaydet
          try {
            // Önce recipeImages tablosundan tarif tipine göre görsel var mı kontrol et
            if (!recipeDetail.imageUrl && recipeType) {
              const getRecipeImageQuery = new GetRecipeImageByTypeQuery();
              const imageResult = await getRecipeImageQuery.execute(recipeType);
              
              if (imageResult.success && imageResult.data) {
                recipeDetail.imageUrl = imageResult.data.imageUrl;
              } else {
                // recipeImages'da görsel bulunamadıysa, yeni görsel oluştur
                const imageUrl = await this.generateAndSaveRecipeImage(recipeTitle, recipeType, recipeId, languageCode);
                if (imageUrl) {
                  recipeDetail.imageUrl = imageUrl;
                }
              }
            } else {
              // imageUrl zaten varsa, dokunma
            }
          } catch (imageError) {
            console.error('Error handling recipe image:', imageError);
            // Görsel işleme hatası olsa bile işleme devam et
          }
          
          // Firebase'e kaydet
          const newRecipeRef = ref(database, `recipes/${recipeDetail.id}`);
          await set(newRecipeRef, recipeDetail);
          
          // Yanıtı formatla
          const formattedResponse = formatPromptResponse(
            recipeDetail,
            {
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