import { Request, Response } from 'express';
import { MenuPromptType } from '../enums/MenuPromptType';
import { GetMenusByMenuTypeQuery } from '../services/MenuServices/Queries/getMenusByMenuTypeQuery';

export class MenuController {
    private getMenusByMenuTypeQuery: GetMenusByMenuTypeQuery;

    constructor() {
        this.getMenusByMenuTypeQuery = new GetMenusByMenuTypeQuery();
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
} 