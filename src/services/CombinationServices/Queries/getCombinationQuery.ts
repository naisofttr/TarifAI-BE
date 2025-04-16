import { ref, query, get } from 'firebase/database';
import { database } from '../../../config/database';
import { IngredientRequestDto } from '../../../dtos/Ingredients/ingredient-request.dto';

interface CombinationData {
    id: string;
    ingredientData: IngredientRequestDto;
    createdAt: string;
}

export interface CombinationQueryResponse {
    success: boolean;
    data?: CombinationData[] | string;
    errorMessage: string;
}

export class GetCombinationQuery {
    async execute(ingredientData: IngredientRequestDto): Promise<CombinationQueryResponse> {
        try {
            console.log("--- REQUESTTEN GELEN NESNE ---");
            console.log(JSON.stringify(ingredientData, null, 2));
            const combinationsRef = ref(database, 'combinations');
            const combinationQuery = query(combinationsRef);
            const snapshot = await get(combinationQuery);

            if (!snapshot.exists()) {
                console.log('Veritabanında hiç combination bulunamadı');
                return {
                    success: true,
                    data: [],
                    errorMessage: 'No combinations found'
                };
            }

            console.log('Veritabanında kayıtlar bulundu, karşılaştırma yapılıyor...');
            let matchingCombinationId: string | null = null;
            
            snapshot.forEach((childSnapshot) => {
                const combination = childSnapshot.val();
                console.log("--- FIREBASE'DEN GELEN NESNE ---");
                console.log(JSON.stringify(combination, null, 2));

                // Hem combination.ingredients hem combination.ingredientData desteği
                const combinationIngredients = combination.ingredients || combination.ingredientData;
                if (combinationIngredients) {
                    const isMatch = this.compareIngredients(combinationIngredients, ingredientData);
                    console.log('Karşılaştırma sonucu:', isMatch);
                    if (isMatch) {
                        console.log('Eşleşme bulundu! Combination ID:', combination.id);
                        matchingCombinationId = combination.id;
                        return true; // forEach döngüsünü sonlandır
                    }
                }
            });

            if (matchingCombinationId) {
                return {
                    success: true,
                    data: matchingCombinationId,
                    errorMessage: 'Matching combination found'
                };
            }

            console.log('Eşleşen combination bulunamadı');
            return {
                success: true,
                data: [],
                errorMessage: 'No matching combination found'
            };

        } catch (error) {
            console.error('Error getting combinations:', error);
            return {
                success: false,
                errorMessage: 'Failed to get combinations'
            };
        }
    }

    private compareIngredients(dbIngredient: any, requestIngredient: any): boolean {
        console.log('Karşılaştırılan veriler:');
        console.log('Veritabanındaki veri:', JSON.stringify(dbIngredient, null, 2));
        console.log('Request verisi:', JSON.stringify(requestIngredient, null, 2));

        // Null kontrolleri
        if (!dbIngredient || !requestIngredient) {
            console.log('Null veri kontrolünde hata');
            return false;
        }

        // Hem ingredientData hem de doğrudan ingredients desteği
        const dbIngredientsObj = dbIngredient.ingredients ? dbIngredient.ingredients : dbIngredient;
        const requestIngredientsObj = requestIngredient.ingredients ? requestIngredient.ingredients : requestIngredient;

        // Tüm ingredient kategorilerini karşılaştır
        const dbKeys = Object.keys(dbIngredientsObj || {});
        const reqKeys = Object.keys(requestIngredientsObj || {});

        // Kategori anahtarları birebir aynı mı?
        if (dbKeys.length !== reqKeys.length || !dbKeys.every(k => reqKeys.includes(k))) {
            console.log('Ingredient kategorileri farklı:', dbKeys, reqKeys);
            return false;
        }

        // Her kategori için array karşılaştırması
        for (const key of dbKeys) {
            const dbArr = dbIngredientsObj[key];
            const reqArr = requestIngredientsObj[key];
            if (!Array.isArray(dbArr) || !Array.isArray(reqArr)) {
                console.log(`${key} array kontrolünde hata`, dbArr, reqArr);
                return false;
            }
            const sortedDbArr = [...dbArr].sort();
            const sortedReqArr = [...reqArr].sort();
            if (sortedDbArr.length !== sortedReqArr.length) {
                console.log(`${key} array uzunlukları farklı`);
                return false;
            }
            const isEqual = sortedDbArr.every((item, idx) => item.toLowerCase() === sortedReqArr[idx].toLowerCase());
            if (!isEqual) {
                console.log(`${key} array içerikleri farklı`);
                return false;
            }
        }
        // Tüm kategoriler birebir aynıysa true
        return true;
    }
}