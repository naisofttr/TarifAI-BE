import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { RecipeImage, RecipeImageResponse } from '../../../models/recipeImage';
import { storage } from '../../../config/firebase.config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Tarif görseli oluşturan servis
 */
export class CreateRecipeImageCommand {
  /**
   * Tarif görseli oluşturur ve Firebase'e kaydeder
   * @param type Tarif tipi (örn: salata, tatlı, ana yemek)
   * @param file Yüklenen görsel dosyası
   * @returns Oluşturulan görsel bilgisi
   */
  async execute(type: string, file: Express.Multer.File): Promise<RecipeImageResponse> {
    try {
      // Tip değerini normalize et (küçük harf, boşlukları kaldır)
      const normalizedType = type.toLowerCase().trim();
      
      // Yeni ID oluştur
      const imageId = uuidv4();
      
      // Firebase Storage'a yükle
      const extension = file.mimetype.split('/')[1] || 'jpg';
      const imageFileName = `recipe_images/${normalizedType}/${imageId}.${extension}`;
      const imageRef = storageRef(storage, imageFileName);
      
      await uploadBytes(imageRef, file.buffer, {
        contentType: file.mimetype
      });
      
      // Yüklenen görselin URL'ini al
      const downloadUrl = await getDownloadURL(imageRef);
      
      // Yeni görsel nesnesi oluştur
      const recipeImage: RecipeImage = {
        id: imageId,
        type: normalizedType,
        imageUrl: downloadUrl,
        createdAt: new Date().toISOString()
      };
      
      // Firebase Realtime Database'e kaydet
      const recipeImagesRef = ref(database, `recipeImages/${imageId}`);
      await set(recipeImagesRef, recipeImage);
      
      return {
        success: true,
        data: recipeImage
      };
    } catch (error) {
      console.error('Error in CreateRecipeImageCommand:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
