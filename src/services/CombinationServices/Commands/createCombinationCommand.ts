import { ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';
import { Combination, CombinationResponse } from '../../../models/combinations';
import { database } from '../../../config/database';
import { GetCombinationQuery } from '../Queries/getCombinationQuery';
import { RangeConverter } from '../../../utils/rangeConverter';

export class CreateCombinationCommand {
    async execute(customerProfileData: CustomerProfileDto): Promise<CombinationResponse> {
        try {
            // Mevcut kombinasyonları kontrol et
            const getCombinationQuery = new GetCombinationQuery();
            const existingCombinations = await getCombinationQuery.execute(customerProfileData);

            if (!existingCombinations.success) {
                return {
                    success: false,
                    errorMessage: 'Kombinasyon bulma hatası.'
                };
            }
            if (existingCombinations.success && existingCombinations.data && existingCombinations.data.length > 0) {
                return {
                    success: true,
                    errorMessage: 'Kombinasyon bulma hatası.',
                    data: existingCombinations.data[0]
                };
            }

            const id = uuidv4();
            const combinationRef = ref(database, `combinations/${id}`);

            // Sayısal değerleri enum aralıklarına dönüştür
            const transformedProfileData = {
                ...customerProfileData,
                age: RangeConverter.getAgeRange(customerProfileData.age),
                height: RangeConverter.getHeightRange(customerProfileData.height),
                weight: RangeConverter.getWeightRange(customerProfileData.weight),
                squatCapacity: RangeConverter.getSquatCapacityRange(customerProfileData.squatCapacity),
                plankDuration: RangeConverter.getPlankDurationRange(customerProfileData.plankDuration),
                dailyWalkingDuration: RangeConverter.getDailyWalkingDurationRange(customerProfileData.dailyWalkingDuration)
            };

            const combination: Combination = {
                id,
                customerProfileData: transformedProfileData,
                programType: 'calisthenics',
                createdAt: new Date().toISOString()
            };

            await set(combinationRef, combination);

            return {
                success: true,
                data: combination,
                errorMessage: 'Combination successfully created'
            };

        } catch (error) {
            console.error('Error generating combination:', error);
            return {
                success: false,
                errorMessage: 'Failed to generate combination'
            };
        }
    }
}