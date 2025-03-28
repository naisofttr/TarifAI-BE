import { ref, query, get, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../config/database';
import { CustomerProfileDto } from '../../../dtos/CustomerProfile/customerProfileDto';
import { CombinationListResponse, Combination } from '../../../models/combinations';
import { RangeConverter } from '../../../utils/rangeConverter';

export class GetCombinationQuery {
    async execute(profileData: CustomerProfileDto): Promise<CombinationListResponse> {
        try {
            // Sayısal değerleri range'e dönüştür
            const profileDataWithRanges = {
                ...profileData,
                age: RangeConverter.getAgeRange(profileData.age),
                height: RangeConverter.getHeightRange(profileData.height),
                weight: RangeConverter.getWeightRange(profileData.weight),
                squatCapacity: RangeConverter.getSquatCapacityRange(profileData.squatCapacity),
                plankDuration: RangeConverter.getPlankDurationRange(profileData.plankDuration),
                dailyWalkingDuration: RangeConverter.getDailyWalkingDurationRange(profileData.dailyWalkingDuration)
            };

            // İlk olarak egzersiz deneyim seviyesine göre verileri çek
            const combinationsRef = ref(database, 'combinations');
            const experienceQuery = query(
                combinationsRef,
                orderByChild('customerProfileData/exerciseExperienceType'),
                equalTo(profileData.exerciseExperienceType)
            );

            const snapshot = await get(experienceQuery);
            if (!snapshot.exists()) {
                return {
                    success: true,
                    data: []
                };
            }

            // Diğer kriterlere göre bellek üzerinde filtreleme yap
            let matchingCombinations = Object.values(snapshot.val()) as Combination[];

            // Temel kriterler filtresi
            matchingCombinations = matchingCombinations.filter(combination => {
                const combinationProfile = combination.customerProfileData;
                
                // Zorunlu eşleşmeler
                const mandatoryMatches = 
                    combinationProfile.targetType === profileDataWithRanges.targetType &&
                    combinationProfile.formType === profileDataWithRanges.formType &&
                    combinationProfile.bodyType === profileDataWithRanges.bodyType;

                if (!mandatoryMatches) return false;

                // Range değerleri eşleşmesi
                const hasRangeMatch = 
                    combinationProfile.age === profileDataWithRanges.age &&
                    combinationProfile.height === profileDataWithRanges.height &&
                    combinationProfile.weight === profileDataWithRanges.weight &&
                    combinationProfile.squatCapacity === profileDataWithRanges.squatCapacity &&
                    combinationProfile.plankDuration === profileDataWithRanges.plankDuration &&
                    combinationProfile.dailyWalkingDuration === profileDataWithRanges.dailyWalkingDuration;

                if (!hasRangeMatch) return false;

                // Odak alanları eşleşmesi (en az bir ortak alan olmalı)
                const hasFocusAreaMatch = profileDataWithRanges.focusAreaType.some(area => 
                    combinationProfile.focusAreaType.includes(area)
                );
                if (!hasFocusAreaMatch) return false;

                // Antrenman sıklığı eşleşmesi
                if (combinationProfile.howOftenExercise !== profileDataWithRanges.howOftenExercise) return false;

                // Motivasyon kaynakları eşleşmesi (en az bir ortak kaynak olmalı)
                const hasMotivationMatch = profileDataWithRanges.motivationSources.some(source => 
                    combinationProfile.motivationSources.includes(source)
                );
                if (!hasMotivationMatch) return false;

                // Fiziksel kapasite eşleşmesi
                const hasPhysicalMatch = 
                    combinationProfile.pushUpCapacity === profileDataWithRanges.pushUpCapacity;
                if (!hasPhysicalMatch) return false;

                // Enerji ve uyku düzeni eşleşmesi
                const hasEnergyAndSleepMatch = 
                    combinationProfile.energyLevel === profileDataWithRanges.energyLevel &&
                    combinationProfile.dailySleepDuration === profileDataWithRanges.dailySleepDuration;
                if (!hasEnergyAndSleepMatch) return false;

                // Stres ve motivasyon eşleşmesi
                const hasStressAndMotivationMatch = 
                    combinationProfile.stressFrequency === profileDataWithRanges.stressFrequency &&
                    combinationProfile.motivationLevel === profileDataWithRanges.motivationLevel;
                if (!hasStressAndMotivationMatch) return false;

                // Taahhüt ve tempo eşleşmesi
                const hasCommitmentAndPaceMatch = 
                    combinationProfile.commitmentDuration === profileDataWithRanges.commitmentDuration &&
                    combinationProfile.preferredPace === profileDataWithRanges.preferredPace;
                if (!hasCommitmentAndPaceMatch) return false;

                // Kötü alışkanlıklar eşleşmesi (en az bir ortak alışkanlık olmalı)
                const hasBadHabitsMatch = profileDataWithRanges.badHabits.some(habit => 
                    combinationProfile.badHabits.includes(habit)
                );
                if (!hasBadHabitsMatch) return false;

                // Fiziksel kısıtlamalar ve ortam eşleşmesi
                const hasPhysicalConstraintsMatch = 
                    combinationProfile.hasKneePain === profileDataWithRanges.hasKneePain &&
                    combinationProfile.hasSoundRestriction === profileDataWithRanges.hasSoundRestriction;
                if (!hasPhysicalConstraintsMatch) return false;

                // Ekipman eşleşmesi (en az bir ortak ekipman olmalı)
                const hasEquipmentMatch = profileDataWithRanges.exerciseEquipments.some(equipment => 
                    combinationProfile.exerciseEquipments.includes(equipment)
                );
                if (!hasEquipmentMatch) return false;

                return true;
            });

            return {
                success: true,
                data: matchingCombinations
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