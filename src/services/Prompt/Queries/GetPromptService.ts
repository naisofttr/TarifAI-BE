import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { Request } from 'express';
import { getDeepSeekPrompt } from '../../DeepSeekServices/getDeepSeekPrompt';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreateCurrentPromptCommand } from '../../CurrentPromptServices/Commands/createCurrentPromptCommand';
import { CreateCurrentPromptDto } from '../../../dtos/CurrentPrompt/CreateCurrentPromptDto';

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
                const responseChatGpt = await getChatGptPrompt(
                    this.gptEndpoint,
                    this.gptApiKey,
                    request.languageCode,
                    request.prompt
                );
                console.log(responseChatGpt);
                promptServiceType = PromptServiceType.ChatGpt;
                response = responseChatGpt;
            }

            if (response.choices && response.choices.length > 0) {
                const servicePromptResponse = response.choices[0].message.content;
                // Parse the response string into CreateCurrentPromptDto[]
                let currentPrompt: CreateCurrentPromptDto;
                try {
                    // Check if the response is already in JSON format
                    if (servicePromptResponse.trim().startsWith('{')) {
                        currentPrompt = JSON.parse(servicePromptResponse);
                    } else {
                        // If not JSON, create a JSON structure from the markdown response
                        currentPrompt = {
                            combinationId: combinationId,
                            promptServiceType: promptServiceType,
                            currentPrompts: servicePromptResponse
                        };
                    }
                } catch (error) {
                    console.error('Error parsing response:', error);
                    throw new Error(`Failed to process AI response: ${error}`);
                }
                currentPrompt.combinationId = combinationId;
                currentPrompt.promptServiceType = promptServiceType;
                
                const createCurrentPromptCommand = new CreateCurrentPromptCommand();
                const currentPromptResponse = await createCurrentPromptCommand.execute({
                    combinationId: combinationId,
                    languageCode: request.languageCode,
                    servicePromptResponse: servicePromptResponse,
                    promptServiceType: promptServiceType
                });

                if (!currentPromptResponse.success) {
                    throw new Error(currentPromptResponse.errorMessage);
                }

                return {
                    data: currentPrompt,
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