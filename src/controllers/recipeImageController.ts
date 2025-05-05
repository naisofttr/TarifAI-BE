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
      const { type, imageUrl } = req.body;
      
      // Gerekli alanları kontrol et
      if (!type || !imageUrl) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Type and imageUrl are required'
        });
      }
      
      // Görsel oluşturma servisini çağır
      const createRecipeImageCommand = new CreateRecipeImageCommand();
      const result = await createRecipeImageCommand.execute(type, imageUrl);
      
      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createRecipeImage controller:', error);
      return res.status(500).json({
        success: false,
        errorMessage: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
};
