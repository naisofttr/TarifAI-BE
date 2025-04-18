import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CurrentPromptDto } from '../../../dtos/CurrentPrompt/CurrentPromptDto';
import { CurrentPrompt, CreatedCurrentPromptResponse } from '../../../models/currentPrompt';
import { v4 as uuidv4 } from 'uuid';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreateCurrentPromptArrayDto, CurrentPromptArrayItemDto } from '../../../dtos/CurrentPrompt/CreateCurrentPromptArrayDto';

export class CreateCurrentPromptArrayCommand {
    async execute(request: CreateCurrentPromptArrayDto | any[]): Promise<CreatedCurrentPromptResponse> {
        try {
            const results: CurrentPrompt[] = [];
            
            // Input validation and normalization
            let dataItems: CurrentPromptArrayItemDto[] = [];
            
            if (Array.isArray(request)) {
                // Handle array input format from example
                dataItems = request.map(item => {
                    return {
                        combinationId: item.data.combinationId,
                        promptServiceType: item.data.promptServiceType,
                        servicePromptResponse: item.data.servicePromptResponse
                    };
                });
            } else if (request.data && Array.isArray(request.data)) {
                dataItems = request.data;
            } else {
                return {
                    success: false,
                    errorMessage: 'Geçersiz istek formatı. Array veya data property içinde array olmalıdır.'
                };
            }
            
            for (const item of dataItems) {
                const currentPromptDto: CurrentPromptDto = {
                    combinationId: item.combinationId,
                    languageCode: 'tr', // Varsayılan dil kodu
                    servicePromptResponse: item.servicePromptResponse,
                    promptServiceType: item.promptServiceType
                };
                
                const id = uuidv4();
                const promptRef = ref(database, `currentPrompts/${id}`);
                
                const currentPrompt: CurrentPrompt = {
                    id,
                    combinationId: currentPromptDto.combinationId,
                    languageCode: currentPromptDto.languageCode,
                    servicePromptResponse: currentPromptDto.servicePromptResponse,
                    promptServiceType: currentPromptDto.promptServiceType,
                    confirmedCount: 0,
                    createdAt: new Date().toISOString()
                };
                
                await set(promptRef, currentPrompt);
                results.push(currentPrompt);
            }
            
            return {
                success: true,
                data: results.length > 0 ? results[0] : undefined,
                errorMessage: `${results.length} adet current prompt başarıyla oluşturuldu`
            };
        } catch (error) {
            console.error('Toplu current prompt oluşturma hatası:', error);
            return {
                success: false,
                errorMessage: 'Toplu current prompt oluşturma işlemi başarısız oldu'
            };
        }
    }
} 