import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { IngredientRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CreatedCombinationResponse {
    success: boolean;
    data?: {
        id: string;
        ingredientRequest: IngredientRequestDto;
    };
    errorMessage?: string;
}

export class CreateCombinationCommand {
    async execute(request: IngredientRequestDto): Promise<CreatedCombinationResponse> {
        try {
            const id = uuidv4();
            const combinationRef = ref(database, `combinations/${id}`);
            
            await set(combinationRef, {
                id,
                ingredients: request.ingredients,
                createdAt: new Date().toISOString()
            });
            
            return {
                success: true,
                data: {
                    id,
                    ingredientRequest: request
                },
                errorMessage: 'Combination successfully created'
            };
        } catch (error) {
            console.error('Error creating combination:', error);
            return {
                success: false,
                errorMessage: 'Failed to create combination'
            };
        }
    }
}