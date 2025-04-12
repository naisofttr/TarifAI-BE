import { IngredientCategoriesDto } from "../dtos/Ingredients/ingredient-request.dto";

export const generatePromptContent = (languageCode: string, ingredients: IngredientCategoriesDto): string => {
    // Prompt template'ini oluştur
    const promptTemplate = [
        `You are a professional chef. Please respond in ${languageCode}.`,
        '',
        'Available ingredients (in JSON format):',
        JSON.stringify(ingredients, null, 2),
        '',
        'Using only these ingredients, suggest recipes. For each recipe, provide:',
        '1. Name',
        '2. Difficulty (Easy/Medium/Hard)',
        '3. Prep time',
        '4. Cook time',
        '5. Servings',
        '6. Required ingredients from the list',
        '7. Step by step instructions',
        '',
        'Important: Only use ingredients from the provided list.'
    ];

    // Template'i birleştir ve düzenli bir format oluştur
    return promptTemplate.join('\n');
};