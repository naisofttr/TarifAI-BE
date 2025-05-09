import { Request, Response } from 'express';
import { GetRecipeDetailQuery } from '../services/RecipeServices/Queries/getRecipeDetailQuery';
import { CreateRecipeCommand } from '../services/RecipeServices/Commands/createRecipeCommand';
import { RecipeDetailDto } from '../dtos/Recipes/recipe-detail.dto';
import { GetRecipesByMenuIdQuery } from '../services/RecipeServices/Queries/getRecipesByMenuIdQuery';

/**
 * @description Belirtilen ID'ye sahip tarifin detaylarını getirir
 * @param req Express Request nesnesi
 * @param res Express Response nesnesi
 * @returns Tarif detayları
 */
export const getRecipeDetail = async (req: Request, res: Response) => {
  try {
    const getRecipeDetailQuery = new GetRecipeDetailQuery();
    const result = await getRecipeDetailQuery.execute(req);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in getRecipeDetail controller:', error);
    return res.status(500).json({
      success: false,
      data: null,
      errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
    });
  }
};

/**
 * @description Yeni bir tarif oluşturur
 * @param req Express Request nesnesi
 * @param res Express Response nesnesi
 * @returns Oluşturulan tarif bilgisi
 */
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const recipeData = req.body as RecipeDetailDto;
    const menuId = req.query.menuId as string | undefined;
    
    const createRecipeCommand = new CreateRecipeCommand();
    const result = await createRecipeCommand.execute(recipeData, menuId);
    
    return res.status(201).json({
      success: true,
      data: result,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error in createRecipe controller:', error);
    return res.status(500).json({
      success: false,
      data: null,
      errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
    });
  }
};

/**
 * @description Belirli bir menüye ait tarifleri getirir
 * @param req Express Request nesnesi
 * @param res Express Response nesnesi
 * @returns Menüye ait tarifler
 */
export const getRecipesByMenuId = async (req: Request, res: Response) => {
  try {
    const menuId = req.params.menuId;
    const languageCode = req.query.languageCode as string | undefined;
    
    if (!menuId) {
      return res.status(400).json({
        success: false,
        data: null,
        errorMessage: 'Menü ID belirtilmelidir'
      });
    }
    
    const getRecipesByMenuIdQuery = new GetRecipesByMenuIdQuery();
    const result = await getRecipesByMenuIdQuery.execute(menuId, languageCode);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in getRecipesByMenuId controller:', error);
    return res.status(500).json({
      success: false,
      data: null,
      errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
    });
  }
};