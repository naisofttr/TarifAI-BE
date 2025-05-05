import { Request } from 'express';
import { ref, query, get, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../config/database';
import { CreateCombinationCommand } from '../../CombinationServices/Commands/createCombinationCommand';
import { GetPromptService } from '../../Prompt/Queries/GetPromptService';
import { GetCombinationQuery } from '../../CombinationServices/Queries/getCombinationQuery';
import { GetRecipeImageByTypeQuery } from '../../RecipeImageServices/Queries/getRecipeImageByTypeQuery';
import { IngredientRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';
import { PromptType } from '../../../enums/PromptType';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { formatPromptResponse } from '../../../utils/responseFormatter';

// Firebase prompt için interface tanımı
interface FirebasePrompt {
    combinationId: string;
    promptServiceType: PromptServiceType;
    promptType: PromptType;
    confirmedCount?: number;
    createdAt: string;
    id: string;
    languageCode: string;
    servicePromptResponse: string;
}

interface CurrentPromptResponse {
    success: boolean;
    data?: any;
    errorMessage: string;
}

export class GetCurrentPromptQuery {
    async execute(req: Request): Promise<CurrentPromptResponse> {
        try {
            const { ingredientData, languageCode, promptType } = req.body;
            
            // promptType'ı uygun PromptType enum değerine dönüştür
            let promptTypeEnum: PromptType | undefined = undefined;
            
            if (promptType !== undefined) {
                if (typeof promptType === 'string') {
                    const promptTypeLower = promptType.toLowerCase();
                    if (promptTypeLower === 'recipe') {
                        promptTypeEnum = PromptType.Recipe;
                    } else if (promptTypeLower === 'menu') {
                        promptTypeEnum = PromptType.Menu;
                    }
                } else if (typeof promptType === 'number') {
                    // Eğer doğrudan enum değeri olarak geldiyse
                    if (promptType === PromptType.Recipe || promptType === PromptType.Menu) {
                        promptTypeEnum = promptType;
                    }
                }
            }
            
            // Varsayılan değer olarak Recipe kullan
            if (promptTypeEnum === undefined) {
                promptTypeEnum = PromptType.Recipe;
            }
            
            // Önce GetCombinationQuery'yi çağır
            const getCombinationQuery = new GetCombinationQuery();
            const combinationResult = await getCombinationQuery.execute(ingredientData as IngredientRequestDto);

            // combinationResult'ın içeriği güvenli şekilde kontrol ediliyor
            if (combinationResult && combinationResult.success && typeof combinationResult.data === 'string' && combinationResult.data.length > 0) {
                console.log('Combination Result Data:', combinationResult.data);
                
                // currentPrompts koleksiyonunda combinationId'ye göre arama yap
                const promptRef = ref(database, 'currentPrompts');
                
                // Hem combinationId hem de promptType ile eşleşen kayıtları filtrele
                const promptQuery = query(
                    promptRef,
                    orderByChild('combinationId'),
                    equalTo(combinationResult.data)
                );
                
                const currentPromptSnapshot = await get(promptQuery);
                console.log('Snapshot exists:', currentPromptSnapshot.exists());
                
                if (currentPromptSnapshot.exists()) {
                    // Tüm eşleşen promptları al
                    const allPrompts = Object.values(currentPromptSnapshot.val()) as FirebasePrompt[];
                    
                    // promptType'a göre filtreleme yap
                    const matchingPrompts = allPrompts.filter((prompt: FirebasePrompt) => 
                        prompt.promptType === promptTypeEnum
                    );
                    
                    if (matchingPrompts.length > 0) {
                        // İstenen promptType'a sahip bir kayıt bulundu
                        console.log('Found prompt with matching promptType:', matchingPrompts[0]);
                        
                        // Firebase'den gelen promptu al
                        const firebasePrompt: FirebasePrompt = matchingPrompts[0];
                        
                        // Firebase'den gelen servicePromptResponse'u JSON nesnesine çevir
                        let parsedPromptResponse;
                        try {
                            parsedPromptResponse = JSON.parse(firebasePrompt.servicePromptResponse);
                        } catch (error) {
                            console.error('Error parsing servicePromptResponse:', error);
                            parsedPromptResponse = { error: 'Failed to parse prompt response' };
                        }
                        
                        // Ortak formatı kullanarak yanıt formatını oluştur
                        const formattedResponse = formatPromptResponse(
                            parsedPromptResponse,
                            {
                                combinationId: firebasePrompt.combinationId,
                                promptServiceType: firebasePrompt.promptServiceType,
                                promptType: firebasePrompt.promptType,
                                languageCode: firebasePrompt.languageCode,
                                confirmedCount: firebasePrompt.confirmedCount || 0,
                                createdAt: firebasePrompt.createdAt,
                                id: firebasePrompt.id
                            }
                        );
                        
                        // Eğer recipeList veya menuList varsa ve imageUrl yoksa, görsel ekle
                        if (parsedPromptResponse.recipeList || parsedPromptResponse.menuList) {
                            const items = parsedPromptResponse.recipeList || parsedPromptResponse.menuList || [];
                            
                            // Her bir tarif için görsel kontrolü yap
                            for (const item of items) {
                                if (!item.imageUrl && item.type) {
                                    try {
                                        // Tarif tipine göre görsel al
                                        const getRecipeImageQuery = new GetRecipeImageByTypeQuery();
                                        const imageResult = await getRecipeImageQuery.execute(item.type);
                                        
                                        if (imageResult.success && imageResult.data) {
                                            item.imageUrl = imageResult.data.imageUrl;
                                        }
                                    } catch (error) {
                                        console.error(`Error getting image for recipe type ${item.type}:`, error);
                                    }
                                }
                            }
                        }
                        
                        return {
                            success: true,
                            data: formattedResponse,
                            errorMessage: 'Current prompt found in database'
                        };
                    } else {
                        // combination bulundu ama istenen promptType için kayıt yoksa, yeni prompt oluştur
                        const getPromptService = new GetPromptService();
                        const promptRequest = {
                            prompt: ingredientData,
                            languageCode: languageCode,
                            promptType: promptTypeEnum
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
                            errorMessage: `New prompt created for existing combination with promptType: ${promptTypeEnum}`
                        };
                    }
                } else {
                    // combination bulundu ama currentPrompt kaydı yoksa, yeni prompt oluşturulacak
                    const getPromptService = new GetPromptService();
                    const promptRequest = {
                        prompt: ingredientData,
                        languageCode: languageCode,
                        promptType: promptTypeEnum
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
                languageCode: languageCode,
                promptType: promptTypeEnum
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