import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../../../config/database';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';

interface CombinationData {
    id: string;
    customerProfileData: CustomerProfileDto;
    createdAt: string;
}

interface CombinationQueryResponse {
    success: boolean;
    data?: CombinationData[];
    errorMessage?: string;
}

export class GetCombinationQuery {
    async execute(profileData: CustomerProfileDto): Promise<CombinationQueryResponse> {
        try {
            const combinationsRef = ref(database, 'combinations');
            const combinationQuery = query(
                combinationsRef,
                orderByChild('customerProfileData/exerciseExperience'),
                equalTo(profileData.exerciseExperience)
            );

            const snapshot = await get(combinationQuery);

            if (!snapshot.exists()) {
                return {
                    success: true,
                    data: [],
                    errorMessage: 'No combinations found'
                };
            }

            const combinations: CombinationData[] = [];
            snapshot.forEach((childSnapshot) => {
                combinations.push(childSnapshot.val());
            });

            return {
                success: true,
                data: combinations,
                errorMessage: 'Combinations found'
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