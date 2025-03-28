import { ref, set, get } from 'firebase/database';
import { CustomerProfile, CreatedCustomerProfileResponse } from '../../../models/customerProfile';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../../config/database';
import { Request } from 'express';

export class CreateCustomerProfileCommand {
    async execute(customerId: string, data: CustomerProfile, req: Request): Promise<CreatedCustomerProfileResponse> {
        try {
            // ID'ye göre kontrol et
            const profileRef = ref(database, `customerProfiles/${data.id || ''}`);
            const snapshot = await get(profileRef);

            if (snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'A profile with this ID already exists'
                };
            }

            // Yeni profil oluştur
            const id = data.id || uuidv4();
            const newProfileRef = ref(database, `customerProfiles/${id}`);

            const profileData: CustomerProfile = {
                ...data,
                id: id,
                customerId: customerId,
                createdAt: new Date().toISOString()
            };

            await set(newProfileRef, profileData);

            return {
                success: true,
                data: profileData
            };
        } catch (error) {
            console.error('Error creating customer profile:', error);
            return {
                success: false,
                errorMessage: 'Failed to create customer profile'
            };
        }
    }
}
