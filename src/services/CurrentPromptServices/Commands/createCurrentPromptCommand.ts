import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CurrentPromptDto } from '../../../dtos/CurrentPrompt/CurrentPromptDto';
import { CurrentPrompt, CreatedCurrentPromptResponse } from '../../../models/currentPrompt';
import { v4 as uuidv4 } from 'uuid';

export class CreateCurrentPromptCommand {
    async execute(request: CurrentPromptDto): Promise<CreatedCurrentPromptResponse> {
        try {
            const id = uuidv4();
            const promptRef = ref(database, `currentPrompts/${id}`);
            
            const currentPrompt: CurrentPrompt = {
                id,
                combinationId: request.combinationId,
                languageCode: request.languageCode,
                servicePromptResponse: request.servicePromptResponse,
                promptServiceType: request.promptServiceType,
                promptType: request.promptType,
                confirmedCount: 0,
                createdAt: new Date().toISOString()
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
