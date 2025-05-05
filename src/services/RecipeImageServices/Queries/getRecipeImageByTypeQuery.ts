import { ref, query, get, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../config/database';
import { RecipeImage, RecipeImageResponse } from '../../../models/recipeImage';

/**
 * Tarif tipine göre görsel getiren servis
 */
export class GetRecipeImageByTypeQuery {
  /**
   * Tarif tipine göre görsel getirir
   * @param type Tarif tipi (örn: salata, tatlı, ana yemek)
   * @returns Görsel bilgisi
   */
  async execute(type: string): Promise<RecipeImageResponse> {
    try {
      // Tip değerini normalize et (küçük harf, boşlukları kaldır)
      const normalizedType = type.toLowerCase().trim();
      
      // recipeImages koleksiyonunda type'a göre arama yap
      const imagesRef = ref(database, 'recipeImages');
      const imagesQuery = query(
        imagesRef,
        orderByChild('type'),
        equalTo(normalizedType)
      );
      
      const snapshot = await get(imagesQuery);
      
      if (snapshot.exists()) {
        // Tüm eşleşen görselleri al
        const images = Object.values(snapshot.val()) as RecipeImage[];
        
        if (images.length > 0) {
          // Rastgele bir görsel seç (birden fazla varsa)
          const randomIndex = Math.floor(Math.random() * images.length);
          return {
            success: true,
            data: images[randomIndex]
          };
        }
      }
      
      return {
        success: false,
        errorMessage: `No image found for type: ${type}`
      };
    } catch (error) {
      console.error('Error in GetRecipeImageByTypeQuery:', error);
      return {
        success: false,
        errorMessage: `Failed to get recipe image: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
