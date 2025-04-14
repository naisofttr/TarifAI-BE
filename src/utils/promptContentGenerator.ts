import { IngredientCategoriesDto } from "../dtos/Ingredients/ingredient-request.dto";

export const generatePromptContent = (languageCode: string, ingredients: IngredientCategoriesDto): string => {
    // Prompt template'ini oluştur
    const promptTemplate = [
        `You are a professional chef. Please respond in ${languageCode}.`,
        '',
        'Available ingredients (in JSON format):',
        JSON.stringify(ingredients, null, 2),
        '',
        'Using these ingredients, suggest possible recipes. Your response MUST be in the following JSON format ONLY:',
        '{',
        '  "recipeList": [',
        '    {',
        '      "title": "recipe name",',
        '      "type": "main course/appetizer/dessert/soup/salad",',
        '      "missingIngredientCount": "number of missing ingredients needed (0 if all ingredients are available)"',
        '    }',
        '  ]',
        '}',
        '',
        'Important:',
        '1. Response must be ONLY in the specified JSON format, no additional text',
        '2. Only suggest recipes that can be made with the provided ingredients',
        '3. If a recipe needs additional ingredients not in the list, include it but set the correct missingIngredientCount',
        '4. Ensure the response is valid JSON'
    ];

    // Template'i birleştir ve düzenli bir format oluştur
    return promptTemplate.join('\n');
};