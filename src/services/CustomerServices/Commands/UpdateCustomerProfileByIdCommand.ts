import { ref, get, update } from 'firebase/database';
import { CustomerProfile, CreatedCustomerProfileResponse } from '../../../models/customerProfile';
import { database } from '../../../config/database';

export class UpdateCustomerProfileByIdCommand {
    async execute(id: string, data: Partial<CustomerProfile>): Promise<CreatedCustomerProfileResponse> {
        try {
            const profileRef = ref(database, `customerProfiles/${id}`);
            const snapshot = await get(profileRef);

            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Profile not found'
                };
            }

            const existingProfile = snapshot.val();
            const updates = {
                [`customerProfiles/${id}`]: {
                    ...existingProfile,
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            };

            await update(ref(database), updates);
            
            // Güncellenmiş profili al ve döndür
            const updatedSnapshot = await get(profileRef);
            const updatedProfile = updatedSnapshot.val();
            
            return {
                success: true,
                data: updatedProfile
            };
        } catch (error) {
            console.error('Error updating customer profile:', error);
            return {
                success: false,
                errorMessage: 'Failed to update customer profile'
            };
        }
    }
}
