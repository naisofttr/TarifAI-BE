import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';
import { IngredientRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CombinationData {
    id: string;
    ingredientData: IngredientRequestDto;
    createdAt: string;
}

export interface CombinationQueryResponse {
    success: boolean;
    data?: CombinationData[] | string;
    errorMessage: string;
}

export class GetCombinationQuery {
    async execute(ingredientData: IngredientRequestDto): Promise<CombinationQueryResponse> {
        try {
            const combinationsRef = ref(database, 'combinations');
            const combinationQuery = query(combinationsRef);
            const snapshot = await get(combinationQuery);

            if (!snapshot.exists()) {
                return {
                    success: true,
                    data: [],
                    errorMessage: 'No combinations found'
                };
            }

            let matchingCombinationId: string | null = null;
            
            snapshot.forEach((childSnapshot) => {
                const combination = childSnapshot.val();
                if (JSON.stringify(combination.ingredientData.ingredients) === 
                    JSON.stringify(ingredientData.ingredients)) {
                    matchingCombinationId = childSnapshot.key;
                    return true; // Break the forEach loop
                }
            });

            if (matchingCombinationId) {
                return {
                    success: true,
                    data: matchingCombinationId,
                    errorMessage: 'Matching combination found'
                };
            }

            return {
                success: true,
                data: [],
                errorMessage: 'No matching combination found'
            };

        } catch (error) {
            console.error('Error getting combinations:', error);
            return {
                success: false,
                errorMessage: 'Failed to get combinations'
            };
        }
    }
}