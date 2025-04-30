import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { Request } from 'express';
import { getDeepSeekPrompt } from '../../DeepSeekServices/getDeepSeekPrompt';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreateCurrentPromptCommand } from '../../CurrentPromptServices/Commands/createCurrentPromptCommand';
import { CreateCurrentPromptDto } from '../../../dtos/CurrentPrompt/CreateCurrentPromptDto';
import { PromptType } from '../../../enums/PromptType';
import { formatPromptResponse } from '../../../utils/responseFormatter';

export class GetPromptService {
    private gptApiKey: string;
    private gptEndpoint: string;
    private deepApiKey: string;
    private deepEndpoint: string;

    constructor() {
        this.gptApiKey = process.env.OPENAI_API_KEY || '';
        this.gptEndpoint = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
        this.deepApiKey = process.env.DEEPSEEK_API_KEY || '';
        this.deepEndpoint = process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com';
    }

    async getPromptResponse(request: PromptRequest, req: Request, combinationId: string): Promise<PromptResponse> {
        try {
            let promptServiceType = PromptServiceType.DeepSeek;
            // DeepSeek API'sine istek at
            let response = undefined;
            //await getDeepSeekPrompt(
            //    this.deepEndpoint,
            //    this.deepApiKey,
            //    request.languageCode,
            //    request.prompt
            //);

            // Eğer sonuç dönmezse, ChatGpt API'sine istek at
            if (response === undefined){
                // promptType değerini belirle, varsayılan olarak Recipe kullan
                const promptType = request.promptType !== undefined ? request.promptType : PromptType.Recipe;
                
                const responseChatGpt = await getChatGptPrompt(
                    this.gptEndpoint,
                    this.gptApiKey,
                    request.languageCode,
                    request.prompt,
                    promptType
                );
                promptServiceType = PromptServiceType.ChatGpt;
                response = responseChatGpt;
            }

            if (response.choices && response.choices.length > 0) {
                const servicePromptResponse = response.choices[0].message.content;
                // Parse the response string into CurrentPromptDto
                let parsedResponse;
                try {
                    // Check if the response is already in JSON format
                    if (servicePromptResponse.trim().startsWith('{')) {
                        parsedResponse = JSON.parse(servicePromptResponse);
                    } else {
                        // If not JSON, create a JSON structure from the markdown response
                        parsedResponse = { error: 'Received non-JSON response' };
                    }
                } catch (error) {
                    console.error('Error parsing response:', error);
                    throw new Error(`Failed to process AI response: ${error}`);
                }
                
                // Yanıt tarihini oluştur
                const createdAt = new Date().toISOString();
                
                // Firebase'e kaydetmek için CreateCurrentPromptCommand'i çağır
                const createCurrentPromptCommand = new CreateCurrentPromptCommand();
                const currentPromptResponse = await createCurrentPromptCommand.execute({
                    combinationId: combinationId,
                    languageCode: request.languageCode,
                    servicePromptResponse: servicePromptResponse,
                    promptServiceType: promptServiceType,
                    promptType: request.promptType !== undefined ? request.promptType : PromptType.Recipe
                });

                if (!currentPromptResponse.success) {
                    throw new Error(currentPromptResponse.errorMessage);
                }
                
                // Ortak formatı kullanarak yanıt formatını oluştur
                const formattedResponse = formatPromptResponse(
                    parsedResponse,
                    {
                        combinationId: combinationId,
                        promptServiceType: promptServiceType,
                        promptType: request.promptType !== undefined ? request.promptType : PromptType.Recipe,
                        languageCode: request.languageCode,
                        confirmedCount: 0,
                        createdAt: createdAt,
                        id: currentPromptResponse.data?.id || ''
                    }
                );

                return {
                    data: formattedResponse,
                    message: currentPromptResponse.errorMessage || '',
                    confirmedCount: 0,
                    success: true
                };
            }

            throw new Error('No response from Prompt Service');

        } catch (error) {
            console.error('Prompt Service API Error:', error);
            return {
                data: undefined,
                message: '',
                error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu',
                success: false
            };
        }
    }
}