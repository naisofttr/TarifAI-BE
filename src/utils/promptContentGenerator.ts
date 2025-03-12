export const generatePromptContent = (languageCode: string, prompt: string): string => {
    // Virgülle ayrılmış malzeme listesini diziye çeviriyoruz
    const ingredients = prompt.split(',').map(item => item.trim()).filter(item => item !== '');
    
    return `In ${languageCode} language, create 5 dinner recipes using these ingredients: ${ingredients.join(', ')}. Only include recipes that can be made with these ingredients. Provide detailed instructions for each recipe. (max.1000char)`;
};
