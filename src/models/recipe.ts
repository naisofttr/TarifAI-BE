import { IngredientDto, NutritionalValuesDto } from '../dtos/Recipes/recipe-detail.dto';

export interface RecipeModel {
  id: string;
  title: string;
  type: string;
  preparationTime?: number;
  cookingTime?: number;
  difficulty?: string;
  servings?: number;
  ingredients: IngredientDto[];
  instructions: string[];
  nutritionalValues?: NutritionalValuesDto;
  imageUrl?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  combinationId?: string;
  languageCode?: string;
  createdAt: string;
} 