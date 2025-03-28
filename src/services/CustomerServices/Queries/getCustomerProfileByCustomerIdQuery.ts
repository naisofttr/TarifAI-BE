import { ref, get } from 'firebase/database';
import { database } from '../../../config/database';
import { CustomerProfile, CreatedCustomerProfileResponse } from '../../../models/customerProfile';

export class GetCustomerProfileByCustomerIdQuery {
    async execute(customerId: string): Promise<CreatedCustomerProfileResponse> {
        try {
            if (!customerId) {
                return {
                    success: false,
                    errorMessage: 'Customer ID is required'
                };
            }

            const profileRef = ref(database, `customerProfiles/${customerId}`);
            const snapshot = await get(profileRef);

            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Customer profile not found'
                };
            }

            return {
                success: true,
                data: snapshot.val() as CustomerProfile
            };
        } catch (error) {
            console.error('Error getting customer profile:', error);
            return {
                success: false,
                errorMessage: 'Failed to get customer profile'
            };
        }
    }
}
