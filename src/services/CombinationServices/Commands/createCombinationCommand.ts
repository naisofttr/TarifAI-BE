import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';
import { v4 as uuidv4 } from 'uuid';

interface CreatedCombinationResponse {
    success: boolean;
    data?: {
        id: string;
        customerProfileData: CustomerProfileDto;
    };
    errorMessage?: string;
}

export class CreateCombinationCommand {
    async execute(request: CustomerProfileDto): Promise<CreatedCombinationResponse> {
        try {
            const id = uuidv4();
            const combinationRef = ref(database, `combinations/${id}`);
            
            await set(combinationRef, {
                id,
                customerProfileData: request,
                createdAt: new Date().toISOString()
            });
            
            return {
                success: true,
                data: {
                    id,
                    customerProfileData: request
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