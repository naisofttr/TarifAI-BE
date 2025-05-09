import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';
import { MenuModel } from '../../../models/menu';
import { RecipeModel } from '../../../models/recipe';
import { MenuPromptType } from '../../../enums/MenuPromptType';

interface MenuWithRecipesModel extends MenuModel {
    recipes: RecipeModel[];
}

export interface MenuQueryResponse {
    success: boolean;
    data?: MenuWithRecipesModel[] | [];
    errorMessage: string;
}

export class GetMenusByMenuTypeQuery {
    async execute(menuPromptType: MenuPromptType, languageCode: string): Promise<MenuQueryResponse> {
        try {
            console.log(`Menü sorgusu başladı: ${menuPromptType}, ${languageCode}`);
            
            // 1. Menüleri getir
            const menusRef = ref(database, 'menus');
            
            // menuPromptType'a göre sorgula
            const menuQuery = query(
                menusRef,
                orderByChild('menuPromptType'),
                equalTo(menuPromptType)
            );
            
            const menuSnapshot = await get(menuQuery);
            
            if (!menuSnapshot.exists()) {
                console.log(`${menuPromptType} tipinde menü bulunamadı.`);
                return {
                    success: true,
                    data: [],
                    errorMessage: 'Belirtilen tipte menü bulunamadı'
                };
            }
            
            const menus: MenuModel[] = [];
            const menusWithRecipes: MenuWithRecipesModel[] = [];
            
            // Menüleri topla
            menuSnapshot.forEach((childSnapshot) => {
                const menu = childSnapshot.val() as MenuModel;
                
                // Dil koduna göre filtrele
                if (menu.languageCode === languageCode) {
                    menus.push(menu);
                }
            });
            
            if (menus.length === 0) {
                console.log(`${languageCode} dil kodunda menü bulunamadı.`);
                return {
                    success: true,
                    data: [],
                    errorMessage: 'Belirtilen dilde menü bulunamadı'
                };
            }
            
            // 2. Her menü için reçeteleri getir
            for (const menu of menus) {
                const menuWithRecipes: MenuWithRecipesModel = {
                    ...menu,
                    recipes: []
                };
                
                // Menüye bağlı reçeteleri getir
                if (menu.recipeIds && menu.recipeIds.length > 0) {
                    const recipesRef = ref(database, 'recipes');
                    
                    // Her reçete ID'si için veritabanından sorgula
                    for (const recipeId of menu.recipeIds) {
                        const recipeSnapshot = await get(
                            query(recipesRef, orderByChild('id'), equalTo(recipeId))
                        );
                        
                        if (recipeSnapshot.exists()) {
                            recipeSnapshot.forEach((childSnapshot) => {
                                const recipe = childSnapshot.val() as RecipeModel;
                                
                                // Dil kontrolü yap
                                if (recipe.languageCode === languageCode) {
                                    menuWithRecipes.recipes.push(recipe);
                                }
                            });
                        }
                    }
                }
                
                menusWithRecipes.push(menuWithRecipes);
            }
            
            return {
                success: true,
                data: menusWithRecipes,
                errorMessage: 'Menüler başarıyla getirildi'
            };
            
        } catch (error) {
            console.error('Menü sorgulama hatası:', error);
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Menü sorgulama sırasında beklenmeyen bir hata oluştu'
            };
        }
    }
} 