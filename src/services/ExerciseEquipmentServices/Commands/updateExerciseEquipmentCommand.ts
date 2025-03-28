import { database } from '../../../config/database';
import { ref, get, update } from 'firebase/database';
import { ExerciseEquipment, CreatedExerciseEquipmentResponse } from '../../../models/exerciseEquipment';

export class UpdateExerciseEquipmentCommand {
    async execute(id: string, data: Partial<ExerciseEquipment>): Promise<CreatedExerciseEquipmentResponse> {
        try {
            const equipmentRef = ref(database, `exerciseEquipments/${id}`);
            const snapshot = await get(equipmentRef);

            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Exercise equipment not found'
                };
            }

            const existingEquipment = snapshot.val();
            const updates = {
                [`exerciseEquipments/${id}`]: {
                    ...existingEquipment,
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            };

            await update(ref(database), updates);
            
            const updatedSnapshot = await get(equipmentRef);
            const updatedEquipment = updatedSnapshot.val();
            
            return {
                success: true,
                data: updatedEquipment
            };
        } catch (error) {
            console.error('Error updating exercise equipment:', error);
            return {
                success: false,
                errorMessage: 'Failed to update exercise equipment'
            };
        }
    }
}
