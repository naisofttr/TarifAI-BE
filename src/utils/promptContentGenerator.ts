import { IngredientCategoriesDto } from "../dtos/Ingredients/ingredient-request.dto";

export const generatePromptContent = (languageCode: string, ingredients: IngredientCategoriesDto): string => {
    // Boş olmayan malzeme kategorilerini birleştir
    const availableIngredients = Object.entries(ingredients)
        .map(([category, items]) => {
            if (!items || items.length === 0) return null;
            return `${category}: ${items.join(', ')}`;
        })
        .filter(item => item !== null)
        .join('\n');

    // Ana prompt İngilizce, yanıt dili kullanıcının seçimine göre
    const prompt = `You are a professional chef. Please respond in ${languageCode === 'tr' ? 'Turkish' : 'English'}.

Available ingredients:
${availableIngredients}

Using only these ingredients, suggest recipes. For each recipe, provide:
1. Name
2. Difficulty (Easy/Medium/Hard)
3. Prep time
4. Cook time
5. Servings
6. Required ingredients from the list
7. Step by step instructions

Important: Only use ingredients from the provided list.`;

    return prompt;
};