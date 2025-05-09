import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';
import { RecipeModel } from '../../../models/recipe';

export interface RecipesByMenuIdResponse {
    success: boolean;
    data?: RecipeModel[] | [];
    errorMessage: string;
}

/**
 * Belirli bir menü ID'sine bağlı tarifleri getiren servis
 */
export class GetRecipesByMenuIdQuery {
    /**
     * Menü ID'ye göre tarifleri getirir
     * @param menuId Menü ID
     * @param languageCode Dil kodu (isteğe bağlı)
     * @returns Tariflerin yer aldığı yanıt nesnesi
     */
    async execute(menuId: string, languageCode?: string): Promise<RecipesByMenuIdResponse> {
        try {
            console.log(`Menü ID'ye göre tarif sorgusu başladı: ${menuId}`);
            
            // Tarifleri getir
            const recipesRef = ref(database, 'recipes');
            
            // menuId'ye göre sorgula
            const recipeQuery = query(
                recipesRef,
                orderByChild('menuId'),
                equalTo(menuId)
            );
            
            const recipeSnapshot = await get(recipeQuery);
            
            if (!recipeSnapshot.exists()) {
                console.log(`${menuId} ID'li menüye ait tarif bulunamadı.`);
                return {
                    success: true,
                    data: [],
                    errorMessage: 'Belirtilen menüye ait tarif bulunamadı'
                };
            }
            
            const recipes: RecipeModel[] = [];
            
            // Tarifleri topla
            recipeSnapshot.forEach((childSnapshot) => {
                const recipe = childSnapshot.val() as RecipeModel;
                
                // Dil koduna göre filtrele (eğer belirtilmişse)
                if (!languageCode || recipe.languageCode === languageCode) {
                    recipes.push(recipe);
                }
            });
            
            if (recipes.length === 0 && languageCode) {
                console.log(`${languageCode} dil kodunda tarif bulunamadı.`);
                return {
                    success: true,
                    data: [],
                    errorMessage: 'Belirtilen dilde tarif bulunamadı'
                };
            }
            
            return {
                success: true,
                data: recipes,
                errorMessage: 'Tarifler başarıyla getirildi'
            };
            
        } catch (error) {
            console.error('Tarif sorgulama hatası:', error);
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Tarif sorgulama sırasında beklenmeyen bir hata oluştu'
            };
        }
    }
} 