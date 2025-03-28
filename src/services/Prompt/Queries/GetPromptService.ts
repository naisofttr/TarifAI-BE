import { PromptRequest } from '../../../dtos/Prompt/PromptRequestDto';
import { PromptResponse } from '../../../dtos/Prompt/PromptResponseDto';
import { Request } from 'express';
import { getDeepSeekPrompt } from '../../DeepSeekServices/getDeepSeekPrompt';
import { getChatGptPrompt } from '../../ChatGptServices/getChatGptPrompt';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreateWeeklyRoutineCommand } from '../../WeeklyRoutineServices/Commands/createWeeklyRoutineCommand';
import { CreateWeeklyRoutineDto } from '../../../dtos/WeeklyRoutine/CreateWeeklyRoutineDto';

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
            let response = await getDeepSeekPrompt(
               this.deepEndpoint,
               this.deepApiKey,
               request.languageCode,
               request.prompt
            );

            // Eğer sonuç dönmezse, ChatGpt API'sine istek at
            if (response === undefined){
                const responseChatGpt = await getChatGptPrompt(
                    this.gptEndpoint,
                    this.gptApiKey,
                    request.languageCode,
                    request.prompt
                );
                promptServiceType = PromptServiceType.ChatGpt;
                response = responseChatGpt;
            }

            if (response.choices && response.choices.length > 0) {
                const servicePromptResponse = response.choices[0].message.content;
                // Parse the response string into CreateWeeklyRoutineDto[]
                let weeklyRoutine: CreateWeeklyRoutineDto;
                try {
                    weeklyRoutine = JSON.parse(servicePromptResponse);
                } catch (error) {
                    throw new Error(`Failed to parse AI response into daily routines: ${error}`);
                }
                weeklyRoutine.combinationId = combinationId;
                weeklyRoutine.promptServiceType = promptServiceType;
                // Haftalık rutini kaydet
                const createWeeklyRoutineCommand = new CreateWeeklyRoutineCommand();
                const weeklyRoutineResponse = await createWeeklyRoutineCommand.execute({
                    ...weeklyRoutine
                });

                if (!weeklyRoutineResponse.success) {
                    throw new Error(weeklyRoutineResponse.errorMessage);
                }

                return {
                    data: weeklyRoutine,
                    message: weeklyRoutineResponse.errorMessage || '',
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