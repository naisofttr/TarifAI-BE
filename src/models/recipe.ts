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
  nutritionalValues?: NutritionalValuesDto | null;
  imageUrl?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  combinationId?: string | null;
  menuId?: string | null;
  languageCode?: string;
  createdAt: string;
}