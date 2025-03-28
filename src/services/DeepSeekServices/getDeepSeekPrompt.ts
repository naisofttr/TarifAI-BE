import OpenAI from "openai";
import { generatePromptContent } from "../../utils/promptContentGenerator";
import { CustomerProfileDto } from "../../dtos/CustomerProfile/customerProfileDto";

export const getDeepSeekPrompt = async (
    endpoint: string,
    apiKey: string,
    languageCode: string,
    prompt: CustomerProfileDto
): Promise<any> => {
    try {
        const generatedPrompt = generatePromptContent(languageCode, prompt);
        const openai = new OpenAI({
            baseURL: endpoint,
            apiKey: apiKey
        });
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: generatedPrompt }],
            model: "deepseek-chat",
        });

        return response;
    } catch (error) {
        console.error('Error fetching DeepSeek prompt:', error);
        // throw error;
    }
};
