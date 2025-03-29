import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CurrentPromptDto } from '../../../dtos/CurrentPrompt/CurrentPromptDto';
import { v4 as uuidv4 } from 'uuid';

interface CreatedCurrentPromptResponse {
    success: boolean;
    data?: CurrentPromptDto;
    errorMessage?: string;
}

export class CreateCurrentPromptCommand {
    async execute(request: CurrentPromptDto): Promise<CreatedCurrentPromptResponse> {
        try {
            const id = uuidv4();
            const promptRef = ref(database, `currentPrompts/${id}`);
            
            const currentPrompt: CurrentPromptDto = {
                combinationId: request.combinationId,
                promptServiceType: request.promptServiceType,
                currentPrompts: request.currentPrompts
            };
            
            await set(promptRef, currentPrompt);
            
            return {
                success: true,
                data: currentPrompt,
                errorMessage: 'Current prompt successfully created'
            };
        } catch (error) {
            console.error('Error creating current prompt:', error);
            return {
                success: false,
                errorMessage: 'Failed to create current prompt'
            };
        }
    }
}
