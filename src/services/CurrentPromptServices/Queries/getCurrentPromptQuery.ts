import { Request } from 'express';
import { ref, get } from 'firebase/database';
import { CreateCombinationCommand } from '../../CombinationServices/Commands/createCombinationCommand';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';
import { GetPromptService } from '../../Prompt/Queries/GetPromptService';
import { database } from '../../../config/database';
import { CreateCurrentPromptDto } from '../../../dtos/CurrentPrompt/CreateCurrentPromptDto';

export interface CurrentPromptResponse {
    success: boolean;
    data?: CreateCurrentPromptDto;
    errorMessage?: string;
    combinationId?: string;
}

export class GetCurrentPromptQuery {
    async execute(req: Request): Promise<CurrentPromptResponse> {
        try {
            const { profileData, combinationId } = req.body;

            // Önce mevcut prompt'u kontrol et
            const promptRef = ref(database, `currentPrompts/${combinationId}`);
            const promptSnapshot = await get(promptRef);

            if (promptSnapshot.exists()) {
                return {
                    success: true,
                    data: promptSnapshot.val(),
                    errorMessage: 'Current prompt found in database',
                    combinationId: combinationId
                };
            }

            // Eğer mevcut değilse, yeni bir combination ve prompt oluştur
            const createCombinationCommand = new CreateCombinationCommand();
            const combinationResult = await createCombinationCommand.execute(profileData as CustomerProfileDto);
            const combinationResultMessage = combinationResult.errorMessage;
            let promptResultMessage = '';

            if (combinationResult.success && combinationResult.data?.customerProfileData) {
                // Send to GetPromptService
                const getPromptService = new GetPromptService();
                const promptRequest = {
                    prompt: combinationResult.data.customerProfileData,
                    languageCode: req.body.languageCode
                };

                const promptResponse = await getPromptService.getPromptResponse(promptRequest, req, combinationResult.data.id);
                promptResultMessage = promptResponse.message;

                if (promptResponse.success) {
                    return {
                        success: true,
                        data: promptResponse.data,
                        errorMessage: 'Current prompt successfully created,' + combinationResultMessage + ',' + promptResultMessage,
                        combinationId: combinationResult.data.id
                    };
                }
            }

            return {
                success: false,
                errorMessage: 'Failed to create current prompt,' + combinationResultMessage + ',' + promptResultMessage
            };

        } catch (error) {
            console.error('Error in GetCurrentPromptQuery:', error);
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
            };
        }
    }
}