/**
 * Tarif detayları için prompt içeriği oluşturan yardımcı fonksiyon
 */
export const generateRecipeDetailPrompt = (
  languageCode: string,
  recipeTitle: string,
  recipeType: string
): string => {
  // Prompt template'ini oluştur
  const promptTemplate = [
    `You are a professional chef. Please respond in ${languageCode}.`,
    '',
    'I need detailed information about the following recipe:',
    `Title: ${recipeTitle}`,
    `Type: ${recipeType}`,
    '',
    'Your response MUST be in the following JSON format:',
    `{
      "id": "auto-generated-id",
      "title": "${recipeTitle}",
      "type": "${recipeType}",
      "preparationTime": preparation time in minutes,
      "cookingTime": cooking time in minutes,
      "difficulty": "Easy/Medium/Hard",
      "servings": number of servings,
      "ingredients": [
        {
          "name": "ingredient name",
          "amount": "amount with unit",
          "isOptional": true/false
        }
      ],
      "instructions": [
        "step 1",
        "step 2",
        "..."
      ],
      "nutritionalValues": {
        "calories": number of calories per serving,
        "protein": grams of protein per serving,
        "carbs": grams of carbs per serving,
        "fat": grams of fat per serving,
        "fiber": grams of fiber per serving
      },
      "imageUrl": "",
      "tags": ["tag1", "tag2", "..."],
      "rating": 0,
      "reviewCount": 0
    }`,
    '',
    'Important:',
    '1. Response must be ONLY the specified JSON format, NO markdown formatting, NO code blocks, NO additional text',
    '2. Do NOT wrap your response in ```json or ``` marks',
    '3. Generate approximately 5-10 reasonable ingredients for this recipe',
    '4. Generate 4-8 detailed instructions for preparing this recipe',
    '5. Ensure the response is valid JSON',
    `6. VERY IMPORTANT: ALL text values must be in ${languageCode} language`,
    `7. Do not respond in English if ${languageCode} is different, translate ALL text to ${languageCode}`,
    '8. Leave imageUrl empty, set rating to 0, and reviewCount to 0',
    '9. Use appropriate tags for the recipe type and ingredients'
  ];

  // Template'i birleştir ve düzenli bir format oluştur
  return promptTemplate.join('\n');
}; 