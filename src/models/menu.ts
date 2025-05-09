import { MenuPromptType } from '../enums/MenuPromptType';
import { MenuType } from '../enums/MenuType';

/**
 * Menü modeli
 */
export interface MenuModel {
  id: string;
  title: string;
  menuPromptType: MenuPromptType;
  menuType: MenuType | null;
  recipeIds: string[];
  languageCode?: string;
  createdAt: string;
}

/**
 * Menü yanıt modeli
 */
export interface MenuResponse {
  id: string;
  title: string;
  menuPromptType: MenuPromptType;
  menuType: MenuType | null;
  recipeIds: string[];
  languageCode?: string;
  createdAt: string;
}
