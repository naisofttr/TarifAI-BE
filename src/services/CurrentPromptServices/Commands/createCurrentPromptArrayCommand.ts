import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CurrentPromptDto } from '../../../dtos/CurrentPrompt/CurrentPromptDto';
import { CurrentPrompt, CreatedCurrentPromptResponse } from '../../../models/currentPrompt';
import { v4 as uuidv4 } from 'uuid';
import { PromptServiceType } from '../../../enums/PromptServiceType';

// DTO tanımları
interface CurrentPromptArrayItemDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    currentPrompts: string;
}

interface CreateCurrentPromptArrayDto {
    data: CurrentPromptArrayItemDto[];
}

export class CreateCurrentPromptArrayCommand {
    async execute(request: CreateCurrentPromptArrayDto): Promise<CreatedCurrentPromptResponse> {
        try {
            const results: CurrentPrompt[] = [];
            
            for (const item of request.data) {
                const currentPromptDto: CurrentPromptDto = {
                    combinationId: item.combinationId,
                    servicePromptResponse: item.currentPrompts,
                    promptServiceType: item.promptServiceType
                };
                
                const id = uuidv4();
                const promptRef = ref(database, `currentPrompts/${id}`);
                
                const currentPrompt: CurrentPrompt = {
                    id,
                    combinationId: currentPromptDto.combinationId,
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