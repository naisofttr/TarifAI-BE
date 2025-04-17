import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { CombinationArrayRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CreatedCombinationArrayResponse {
    success: boolean;
    data?: {
        ids: string[];
        requestData: CombinationArrayRequestDto;
    };
    errorMessage?: string;
}

export class CreateCombinationArrayCommand {
    async execute(request: CombinationArrayRequestDto): Promise<CreatedCombinationArrayResponse> {
        try {
            const ids: string[] = [];
            
            // Her kombinasyon için ayrı bir kayıt oluştur
            for (const combination of request.combinations) {
                const id = uuidv4();
                const combinationRef = ref(database, `combinations/${id}`);
                
                await set(combinationRef, {
                    id,
                    ingredients: combination.ingredientData.ingredients,
                    languageCode: combination.languageCode,
                    createdAt: new Date().toISOString()
                });
                
                ids.push(id);
            }
            
            return {
                success: true,
                data: {
                    ids,
                    requestData: request
                },
                errorMessage: 'Combinations successfully created'
            };
        } catch (error) {
            console.error('Error creating combinations:', error);
            return {
                success: false,
                errorMessage: 'Failed to create combinations'
            };
        }
    }
} 