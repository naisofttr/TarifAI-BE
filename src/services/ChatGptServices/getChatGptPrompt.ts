import axios from 'axios';
import { ChatGPTResponse } from '../../dtos/ChatGPT/ChatGPTResponseDto';
import { generatePromptContent } from '../../utils/promptContentGenerator';
import { IngredientCategoriesDto } from '../../dtos/Ingredients/ingredient-request.dto';

export const getChatGptPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: IngredientCategoriesDto
): Promise<ChatGPTResponse> => {
    const response = await axios.post<ChatGPTResponse>(
        endpoint,
        {
            model: "gpt-4o-mini-2024-07-18", // TODO: Change model to gpt-4o-mini-2024-07-18
            messages: [
                {
                    role: "user",
                    content: generatePromptContent(languageCode, prompt)
                }
            ],
            max_tokens: 2500,
            temperature: 0.7
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return response.data;
}
