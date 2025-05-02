import { Request, Response } from 'express';
import { GetRecipeDetailQuery } from '../services/RecipeServices/Queries/getRecipeDetailQuery';

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