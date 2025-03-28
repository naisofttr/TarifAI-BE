import { database } from '../../../config/database';
import { ref, get } from 'firebase/database';
import { ExerciseEquipment } from '../../../models/exerciseEquipment';

interface GetAllExerciseEquipmentsResponse {
    success: boolean;
    data?: ExerciseEquipment[];
    errorMessage?: string;
}

export class GetAllExerciseEquipmentsQuery {
    async execute(): Promise<GetAllExerciseEquipmentsResponse> {
        try {
            const equipmentsRef = ref(database, 'exerciseEquipments');
            const snapshot = await get(equipmentsRef);

            if (!snapshot.exists()) {
                return {
                    success: true,
                    data: []
                };
            }

            // Convert object to array and add each key as id
            const equipments = Object.entries(snapshot.val()).map(([key, value]) => ({
                ...(value as ExerciseEquipment)
            }));

            return {
                success: true,
                data: equipments
            };
        } catch (error) {
            console.error('Error getting exercise equipments:', error);
            return {
                success: false,
                errorMessage: 'Failed to get exercise equipments'
            };
        }
    }
}
