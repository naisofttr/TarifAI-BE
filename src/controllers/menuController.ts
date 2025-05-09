import { Request, Response } from 'express';
import { MenuPromptType } from '../enums/MenuPromptType';
import { GetMenusByMenuTypeQuery } from '../services/MenuServices/Queries/getMenusByMenuTypeQuery';
import { CreateMenuCommand } from '../services/MenuServices/Commands/createMenuCommand';
import { CreateMenuDto } from '../dtos/Menus/create-menu.dto';
import { CreateRecipeCommand } from '../services/RecipeServices/Commands/createRecipeCommand';
import { RecipeDetailDto } from '../dtos/Recipes/recipe-detail.dto';
import { ref, set } from 'firebase/database';
import { database } from '../config/database';

export class MenuController {
    private getMenusByMenuTypeQuery: GetMenusByMenuTypeQuery;
    private createMenuCommand: CreateMenuCommand;
    private createRecipeCommand: CreateRecipeCommand;

    constructor() {
        this.getMenusByMenuTypeQuery = new GetMenusByMenuTypeQuery();
        this.createMenuCommand = new CreateMenuCommand();
        this.createRecipeCommand = new CreateRecipeCommand();
    }

    async getMenusByMenuType(req: Request, res: Response) {
        try {
            const menuPromptType = req.params.menuPromptType as string;
            const languageCode = req.params.languageCode as string;

            // menuPromptType değerini kontrol et
            if (!Object.values(MenuPromptType).includes(menuPromptType as MenuPromptType)) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Geçersiz menü tipi'
                });
            }

            // languageCode geçerliliğini kontrol et
            if (!languageCode || languageCode.length !== 2) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Geçersiz dil kodu'
                });
            }

            const result = await this.getMenusByMenuTypeQuery.execute(menuPromptType as MenuPromptType, languageCode);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Menü listelemede hata:', error);
            return res.status(500).json({
                success: false,
                errorMessage: 'Menü listeleme sırasında bir hata oluştu'
            });
        }
    }

    /**
     * Tekli menü oluşturur
     * @param req Request nesnesi
     * @param res Response nesnesi
     * @returns Oluşturulan menü bilgisi
     */
    async createMenu(req: Request, res: Response) {
        try {
            const menuDto = req.body as CreateMenuDto;
            const recipes = req.body.recipes as RecipeDetailDto[] | undefined;
            
            // Menüyü oluştur
            const menu = await this.createMenuCommand.execute(menuDto);
            
            // Eğer tarifler de gönderildiyse, önce tarifleri oluştur
            if (recipes && recipes.length > 0) {
                const recipeIds = [];
                
                for (const recipeData of recipes) {
                    const recipe = await this.createRecipeCommand.execute(recipeData, menu.id);
                    recipeIds.push(recipe.id);
                }
                
                // Menüye tarif ID'lerini ekle
                menu.recipeIds = [...(menu.recipeIds || []), ...recipeIds];
                
                // Firebase'de menüyü güncelle
                const menuRef = ref(database, `menus/${menu.id}`);
                await set(menuRef, menu);
            }
            
            return res.status(201).json({
                success: true,
                data: menu,
                errorMessage: null
            });
        } catch (error) {
            console.error('Menü oluşturma hatası:', error);
            return res.status(500).json({
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }
    
    /**
     * Çoklu menü oluşturur
     * @param req Request nesnesi
     * @param res Response nesnesi
     * @returns Oluşturulan menü bilgileri
     */
    async createMenus(req: Request, res: Response) {
        try {
            const { menus } = req.body;
            
            if (!Array.isArray(menus) || menus.length === 0) {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'En az bir menü belirtmelisiniz'
                });
            }
            
            const results = [];
            
            for (const menuData of menus) {
                const { menu, recipes } = menuData;
                
                // Menüyü oluştur
                const createdMenu = await this.createMenuCommand.execute(menu);
                
                // Eğer tarifler de gönderildiyse, önce tarifleri oluştur
                if (recipes && recipes.length > 0) {
                    const recipeIds = [];
                    
                    for (const recipeData of recipes) {
                        const recipe = await this.createRecipeCommand.execute(recipeData, createdMenu.id);
                        recipeIds.push(recipe.id);
                    }
                    
                    // Menüye tarif ID'lerini ekle
                    createdMenu.recipeIds = [...(createdMenu.recipeIds || []), ...recipeIds];
                    
                    // Firebase'de menüyü güncelle
                    const menuRef = ref(database, `menus/${createdMenu.id}`);
                    await set(menuRef, createdMenu);
                }
                
                results.push(createdMenu);
            }
            
            return res.status(201).json({
                success: true,
                data: results,
                errorMessage: null
            });
        } catch (error) {
            console.error('Çoklu menü oluşturma hatası:', error);
            return res.status(500).json({
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
            });
        }
    }
} 