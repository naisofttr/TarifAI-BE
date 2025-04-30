import { IngredientCategoriesDto } from "../dtos/Ingredients/ingredient-request.dto";

export const generatePromptContent = (languageCode: string, ingredients: IngredientCategoriesDto, promptType: 'recipe' | 'menu' = 'recipe'): string => {
    // promptType'a göre liste adını belirle
    const listName = promptType === 'recipe' ? 'recipeList' : 'menuList';

    // Prompt template'ini oluştur
    const promptTemplate = [
        `You are a professional chef. Please respond in ${languageCode}.`,
        '',
        'Available ingredients (in JSON format):',
        JSON.stringify(ingredients, null, 2),
        '',
        `Using these ingredients, suggest possible ${promptType}s. Your response MUST be in the following JSON format:`,
        `{"${listName}": [{"title": "recipe name in ${languageCode} language", "type": "main course/appetizer/dessert/soup/salad", "missingIngredientCount": number of missing ingredients needed (0 if all ingredients are available)}]}`,
        '',
        'Important:',
        '1. Response must be ONLY the specified JSON format, NO markdown formatting, NO code blocks, NO additional text',
        '2. Do NOT wrap your response in ```json or ``` marks',
        '3. Only suggest recipes that can be made with the provided ingredients',
        '4. If a recipe needs additional ingredients not in the list, include it but set the correct missingIngredientCount',
        '5. Ensure the response is valid JSON',
        `6. VERY IMPORTANT: ALL text values must be in ${languageCode} language, especially "title" and "type" fields`,
        `7. Do not respond in English if ${languageCode} is different, translate ALL text to ${languageCode}`
    ];

    // Template'i birleştir ve düzenli bir format oluştur
    return promptTemplate.join('\n');
};