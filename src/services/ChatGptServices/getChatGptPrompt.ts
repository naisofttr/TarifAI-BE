import axios from 'axios';
import { ChatGPTResponse } from '../../dtos/ChatGPT/ChatGPTResponseDto';
import { generatePromptContent } from '../../utils/promptContentGenerator';
import { CustomerProfileDto } from '../../dtos/CustomerProfile/customerProfileDto';

export const getChatGptPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: CustomerProfileDto
): Promise<ChatGPTResponse> => {
    const response = await axios.post<ChatGPTResponse>(
        endpoint,
        {
            model: "gpt-3.5-turbo",
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
