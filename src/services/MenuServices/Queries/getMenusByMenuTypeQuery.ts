import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';
import { MenuModel } from '../../../models/menu';
import { MenuPromptType } from '../../../enums/MenuPromptType';

interface SimpleMenuModel {
    id: string;
    title: string;
    menuPromptType: MenuPromptType;
}

export interface MenuQueryResponse {
    success: boolean;
    data?: SimpleMenuModel[] | [];
    errorMessage: string;
}

export class GetMenusByMenuTypeQuery {
    async execute(menuPromptType: MenuPromptType, languageCode: string): Promise<MenuQueryResponse> {
        try {
            console.log(`Menü sorgusu başladı: ${menuPromptType}, ${languageCode}`);
            
            // Menüleri getir
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
            
            const menus: SimpleMenuModel[] = [];
            
            // Menüleri topla
            menuSnapshot.forEach((childSnapshot) => {
                const menu = childSnapshot.val() as MenuModel;
                
                // Dil koduna göre filtrele
                if (menu.languageCode === languageCode) {
                    // Sadece istenen alanları al
                    menus.push({
                        id: menu.id,
                        title: menu.title,
                        menuPromptType: menu.menuPromptType
                    });
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
            
            return {
                success: true,
                data: menus,
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