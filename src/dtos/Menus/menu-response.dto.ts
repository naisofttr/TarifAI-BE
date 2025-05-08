import { z } from 'zod';
import { MenuPromptType } from '../../enums/MenuPromptType';
import { MenuType } from '../../enums/MenuType';
import { RecipeModel } from '../../models/recipe';

/**
 * Menü yanıt DTO şeması
 */
export const MenuResponseDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  menuPromptType: z.nativeEnum(MenuPromptType),
  menuType: z.nativeEnum(MenuType),
  recipes: z.array(z.any()).optional(), // RecipeModel tipinde olacak
  languageCode: z.string().optional(),
  createdAt: z.string(),
});

/**
 * Menü yanıt DTO tipi
 */
export type MenuResponseDto = z.infer<typeof MenuResponseDtoSchema>;
