import { Request } from 'express';
import { ref, get } from 'firebase/database';
import { CreateCombinationCommand } from '../../CombinationServices/Commands/createCombinationCommand';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';
import { GetPromptService } from '../../Prompt/Queries/GetPromptService';
import { database } from '../../../config/database';
import { WeeklyRoutineDto } from '../../../dtos/WeeklyRoutine/WeeklyRoutineDto';

export interface WeeklyRoutineResponse {
    success: boolean;
    data?: WeeklyRoutineDto;
    errorMessage?: string;
    combinationId?: string;
}
export class GetWeeklyRoutineQuery {
    async execute(req: Request): Promise<WeeklyRoutineResponse> {
        try {
            const { profileData, combinationId } = req.body;

            // Önce mevcut weekly routine'u kontrol et
            const weeklyRoutineRef = ref(database, `weeklyRoutines/${combinationId}`);
            const weeklyRoutineSnapshot = await get(weeklyRoutineRef);

            if (weeklyRoutineSnapshot.exists()) {
                return {
                    success: true,
                    data: weeklyRoutineSnapshot.val(),
                    errorMessage: 'WeeklyRoutine found in database',
                    combinationId: combinationId
                };
            }

            // Eğer mevcut değilse, yeni bir combination ve weekly routine oluştur
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
                        errorMessage: 'WeeklyRoutine successfully created,' + combinationResultMessage + ',' + promptResultMessage,
                        combinationId: combinationResult.data.id
                    };
                }
            }

            return {
                success: false,
                errorMessage: 'Failed to create WeeklyRoutine,' + combinationResultMessage + ',' + promptResultMessage
            };

        } catch (error) {
            console.error('Error in GetWeeklyRoutineQuery:', error);
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
            };
        }
    }
}