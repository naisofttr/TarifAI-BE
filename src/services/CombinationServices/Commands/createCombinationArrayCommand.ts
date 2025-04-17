import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { IngredientRequestArrayDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CreatedCombinationArrayResponse {
    success: boolean;
    data?: {
        id: string;
        ingredientRequest: IngredientRequestArrayDto;
    };
    errorMessage?: string;
}

export class CreateCombinationArrayCommand {
    async execute(request: IngredientRequestArrayDto): Promise<CreatedCombinationArrayResponse> {
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
                errorMessage: 'Combination array successfully created'
            };
        } catch (error) {
            console.error('Error creating combination array:', error);
            return {
                success: false,
                errorMessage: 'Failed to create combination array'
            };
        }
    }
} 