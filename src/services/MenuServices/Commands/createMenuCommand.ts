import { ref, set, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { MenuModel, MenuResponse } from '../../../models/menu';
import { CreateMenuDto } from '../../../dtos/Menus/create-menu.dto';
import { MenuType } from '../../../enums/MenuType';

/**
 * Menü oluşturan servis
 */
export class CreateMenuCommand {
  /**
   * Menü oluşturur ve Firebase'e kaydeder
   * @param createMenuDto Menü oluşturma DTO'su
   * @returns Oluşturulan menü bilgisi
   */
  async execute(createMenuDto: CreateMenuDto): Promise<MenuResponse> {
    try {
      // Yeni ID oluştur
      const menuId = uuidv4();
      
      // Şu anki tarihi al
      const now = new Date().toISOString();
      
      // Menü nesnesini oluştur
      const menu: MenuModel = {
        id: menuId,
        title: createMenuDto.title,
        menuPromptType: createMenuDto.menuPromptType,
        menuType: createMenuDto.menuType || null,
        recipeIds: createMenuDto.recipeIds || [],
        languageCode: createMenuDto.languageCode,
        createdAt: now
      };
      
      // Firebase'e kaydet
      const menuRef = ref(database, `menus/${menuId}`);
      await set(menuRef, menu);
      
      // Eğer recipeIds varsa, bu tariflerin menuId'sini güncelle
      if (createMenuDto.recipeIds && createMenuDto.recipeIds.length > 0) {
        for (const recipeId of createMenuDto.recipeIds) {
          const recipeRef = ref(database, `recipes/${recipeId}`);
          // Update kullanarak sadece menuId alanını güncelle
          await update(recipeRef, { menuId: menuId });
        }
      }
      
      return menu;
    } catch (error) {
      console.error('Menü oluşturma hatası:', error);
      throw new Error('Menü oluşturulurken bir hata oluştu');
    }
  }
}
