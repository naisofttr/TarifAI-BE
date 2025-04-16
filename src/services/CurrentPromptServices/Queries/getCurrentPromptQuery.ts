import { Request } from 'express';
import { ref, get } from 'firebase/database';
import { database } from '../../../config/database';
import { CreateCombinationCommand } from '../../CombinationServices/Commands/createCombinationCommand';
import { GetPromptService } from '../../Prompt/Queries/GetPromptService';
import { GetCombinationQuery } from '../../CombinationServices/Queries/getCombinationQuery';
import { IngredientRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CurrentPromptResponse {
    success: boolean;
    data?: any;
    errorMessage: string;
}

export class GetCurrentPromptQuery {
    async execute(req: Request): Promise<CurrentPromptResponse> {
        try {
            const { ingredientData, languageCode } = req.body;
            
            // Önce GetCombinationQuery'yi çağır
            const getCombinationQuery = new GetCombinationQuery();
            const combinationResult = await getCombinationQuery.execute(ingredientData as IngredientRequestDto);

            // combinationResult'ın içeriği güvenli şekilde kontrol ediliyor
            if (combinationResult && combinationResult.success && typeof combinationResult.data === 'string' && combinationResult.data.length > 0) {
                // CombinationId bulundu, currentPrompts'tan veriyi al
                const promptRef = ref(database, `currentPrompts/${combinationResult.data}`);
                const currentPromptSnapshot = await get(promptRef);

                if (currentPromptSnapshot.exists()) {
                    const data = currentPromptSnapshot.val();
                    data.combinationId = combinationResult.data;
                    return {
                        success: true,
                        data: data,
                        errorMessage: 'Current prompt found in database'
                    };
                } else {
                    // combination bulundu ama currentPrompt kaydı yoksa, yeni prompt oluşturulacak
                    const getPromptService = new GetPromptService();
                    const promptRequest = {
                        prompt: ingredientData,
                        languageCode: languageCode
                    };
                    const promptResponse = await getPromptService.getPromptResponse(
                        promptRequest, 
                        req, 
                        combinationResult.data
                    );
                    if (!promptResponse.success) {
                        return {
                            success: false,
                            errorMessage: 'Failed to get prompt response'
                        };
                    }
                    return {
                        success: true,
                        data: promptResponse.data,
                        errorMessage: 'New prompt created for existing combination'
                    };
                }
            }

            // Hiçbir combinationId bulunamazsa yeni combination ve prompt oluştur
            const createCombinationCommand = new CreateCombinationCommand();
            const newCombinationResult = await createCombinationCommand.execute(ingredientData as IngredientRequestDto);

            if (!newCombinationResult.success || !newCombinationResult.data) {
                return {
                    success: false,
                    errorMessage: 'Failed to create new combination'
                };
            }

            // Yeni prompt al
            const getPromptService = new GetPromptService();
            const promptRequest = {
                prompt: ingredientData,
                languageCode: languageCode
            };

            const promptResponse = await getPromptService.getPromptResponse(
                promptRequest, 
                req, 
                newCombinationResult.data.id
            );

            if (!promptResponse.success) {
                return {
                    success: false,
                    errorMessage: 'Failed to get prompt response'
                };
            }

            return {
                success: true,
                data: promptResponse.data,
                errorMessage: 'New prompt created successfully'
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