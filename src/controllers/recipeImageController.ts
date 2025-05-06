import { Request, Response } from 'express';
import { CreateRecipeImageCommand } from '../services/RecipeImageServices/Commands/createRecipeImageCommand';

/**
 * Tarif görselleri için controller
 */
export const recipeImageController = {
  /**
   * Yeni tarif görseli oluşturur
   * @param req Request nesnesi
   * @param res Response nesnesi
   */
  createRecipeImage: async (req: Request, res: Response) => {
    try {
      const { type } = req.body;
      const file = req.file;
      
      // Gerekli alanları kontrol et
      if (!type) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Tarif tipi gereklidir'
        });
      }
      
      if (!file) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Görsel dosyası gereklidir'
        });
      }
      
      // Görsel oluşturma servisini çağır
      const createRecipeImageCommand = new CreateRecipeImageCommand();
      const result = await createRecipeImageCommand.execute(type, file);
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('createRecipeImage controller error:', error);
      return res.status(500).json({
        success: false,
        errorMessage: `Sunucu hatası: ${error instanceof Error ? error.message : 'Bilinmeyen bir hata'}`
      });
    }
  }
};
