import { z } from 'zod';
import { MenuPromptType } from '../../enums/MenuPromptType';
import { MenuType } from '../../enums/MenuType';

/**
 * Menü oluşturma DTO şeması
 */
export const CreateMenuDtoSchema = z.object({
  title: z.string().min(3, { message: 'Başlık en az 3 karakter olmalıdır' }),
  menuPromptType: z.nativeEnum(MenuPromptType, {
    errorMap: () => ({ message: 'Geçerli bir menü prompt tipi seçiniz' }),
  }),
  menuType: z.nativeEnum(MenuType, {
    errorMap: () => ({ message: 'Geçerli bir menü tipi seçiniz' }),
  }),
  recipeIds: z.array(z.string()).optional(),
  languageCode: z.string().optional(),
});

/**
 * Menü oluşturma DTO tipi
 */
export type CreateMenuDto = z.infer<typeof CreateMenuDtoSchema>;
