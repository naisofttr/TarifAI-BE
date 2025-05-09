import { z } from 'zod';

/**
 * Malzeme bilgisi DTO şeması
 */
export const IngredientSchema = z.object({
  name: z.string().min(2, { message: 'Malzeme adı en az 2 karakter olmalıdır' }),
  amount: z.string(),
  isOptional: z.boolean().optional()
});

/**
 * Besin değeri bilgisi DTO şeması
 */
export const NutritionalValuesSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  fiber: z.number().optional()
});

/**
 * Tarif oluşturma DTO şeması
 */
export const CreateRecipeSchema = z.object({
  title: z.string().min(3, { message: 'Başlık en az 3 karakter olmalıdır' }),
  type: z.string().min(2, { message: 'Tür en az 2 karakter olmalıdır' }),
  preparationTime: z.number().min(1).optional(),
  cookingTime: z.number().min(1).optional(),
  difficulty: z.string().optional(),
  servings: z.number().min(1).optional(),
  ingredients: z.array(IngredientSchema),
  instructions: z.array(z.string()),
  nutritionalValues: NutritionalValuesSchema.optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  combinationId: z.string().optional(),
  languageCode: z.string().optional()
});

/**
 * Tarif oluşturma DTO tipi
 */
export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;

/**
 * Tarif yanıt DTO şeması
 */
export const RecipeResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  errorMessage: z.string().nullable()
});

/**
 * Tarif yanıt DTO tipi
 */
export type RecipeResponseDto = z.infer<typeof RecipeResponseSchema>; 