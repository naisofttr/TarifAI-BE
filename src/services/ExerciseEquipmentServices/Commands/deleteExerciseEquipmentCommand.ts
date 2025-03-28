import { database } from '../../../config/database';
import { ref, remove, get } from 'firebase/database';
import { CreatedExerciseEquipmentResponse } from '../../../models/exerciseEquipment';

export class DeleteExerciseEquipmentCommand {
    async execute(id: string): Promise<CreatedExerciseEquipmentResponse> {
        try {
            const equipmentRef = ref(database, `exerciseEquipments/${id}`);
            
            // Check if equipment exists
            const snapshot = await get(equipmentRef);
            if (!snapshot.exists()) {
                return {
                    success: false,
                    errorMessage: 'Exercise equipment not found'
                };
            }

            // Store equipment data before deletion for response
            const equipmentData = snapshot.val();

            // Delete the equipment
            await remove(equipmentRef);
            
            return {
                success: true,
                data: equipmentData,
                errorMessage  : 'Exercise equipment successfully deleted'
            };
        } catch (error) {
            console.error('Error deleting exercise equipment:', error);
            return {
                success: false,
                errorMessage: 'Failed to delete exercise equipment'
            };
        }
    }
}
