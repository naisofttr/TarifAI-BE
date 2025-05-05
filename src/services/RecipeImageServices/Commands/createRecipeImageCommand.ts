import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { RecipeImage, RecipeImageResponse } from '../../../models/recipeImage';

/**
 * Tarif görseli oluşturan servis
 */
export class CreateRecipeImageCommand {
  /**
   * Tarif görseli oluşturur ve Firebase'e kaydeder
   * @param type Tarif tipi (örn: salata, tatlı, ana yemek)
   * @param imageUrl Görsel URL'i
   * @returns Oluşturulan görsel bilgisi
   */
  async execute(type: string, imageUrl: string): Promise<RecipeImageResponse> {
    try {
      // Tip değerini normalize et (küçük harf, boşlukları kaldır)
      const normalizedType = type.toLowerCase().trim();
      
      // Yeni görsel nesnesi oluştur
      const recipeImage: RecipeImage = {
        id: uuidv4(),
        type: normalizedType,
        imageUrl,
        createdAt: new Date().toISOString()
      };
      
      // Firebase'e kaydet
      const recipeImageRef = ref(database, `recipeImages/${recipeImage.id}`);
      await set(recipeImageRef, recipeImage);
      
      return {
        success: true,
        data: recipeImage
      };
    } catch (error) {
      console.error('Error in CreateRecipeImageCommand:', error);
      return {
        success: false,
        errorMessage: `Failed to create recipe image: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
