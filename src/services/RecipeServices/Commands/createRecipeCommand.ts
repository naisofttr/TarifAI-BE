import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { RecipeModel } from '../../../models/recipe';
import { RecipeDetailDto } from '../../../dtos/Recipes/recipe-detail.dto';

/**
 * Tarif oluşturan servis
 */
export class CreateRecipeCommand {
  /**
   * Tarif oluşturur ve Firebase'e kaydeder
   * @param recipeData Tarif verisi
   * @param menuId Bağlı olduğu menü ID'si (isteğe bağlı)
   * @returns Oluşturulan tarif bilgisi
   */
  async execute(recipeData: RecipeDetailDto, menuId?: string): Promise<RecipeModel> {
    try {
      // Eğer ID yoksa yeni oluştur
      const recipeId = recipeData.id || uuidv4();
      
      // Şu anki tarihi al
      const now = new Date().toISOString();
      
      // Tarif nesnesini oluştur
      const recipe: RecipeModel = {
        id: recipeId,
        title: recipeData.title,
        type: recipeData.type,
        preparationTime: recipeData.preparationTime,
        cookingTime: recipeData.cookingTime,
        difficulty: recipeData.difficulty,
        servings: recipeData.servings,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        nutritionalValues: recipeData.nutritionalValues,
        imageUrl: recipeData.imageUrl,
        tags: recipeData.tags,
        rating: recipeData.rating,
        reviewCount: recipeData.reviewCount,
        combinationId: recipeData.combinationId,
        menuId: menuId || undefined,
        languageCode: recipeData.languageCode,
        createdAt: recipeData.createdAt || now
      };
      
      // Firebase'e kaydet
      const recipeRef = ref(database, `recipes/${recipeId}`);
      await set(recipeRef, recipe);
      
      return recipe;
    } catch (error) {
      console.error('Tarif oluşturma hatası:', error);
      throw new Error('Tarif oluşturulurken bir hata oluştu');
    }
  }
} 