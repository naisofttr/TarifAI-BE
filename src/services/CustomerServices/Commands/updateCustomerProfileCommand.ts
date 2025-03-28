import { CustomerProfile, CreatedCustomerProfileResponse } from '../../../models/customerProfile';
import { database } from '../../../config/database';
import { ref, update, get } from 'firebase/database';

export class UpdateCustomerProfileCommand {
    async execute(customerId: string, data: Partial<CustomerProfile>): Promise<CreatedCustomerProfileResponse> {
        try {
            const profileRef = ref(database, `customerProfiles/${customerId}`);
            const snapshot = await get(profileRef);

            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Customer profile not found'
                };
            }

            const existingProfile = snapshot.val();
            const updates = {
                [`customerProfiles/${customerId}`]: {
                    ...existingProfile,
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            };

            await update(ref(database), updates);
            
            return {
                success: true,
                data: updates[`customerProfiles/${customerId}`]
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
