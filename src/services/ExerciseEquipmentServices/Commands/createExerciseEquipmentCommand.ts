import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { ExerciseEquipment, CreatedExerciseEquipmentResponse } from '../../../models/exerciseEquipment';
import { v4 as uuidv4 } from 'uuid';

export class CreateExerciseEquipmentCommand {
    async execute(data: Omit<ExerciseEquipment, 'id' | 'createdAt'>): Promise<CreatedExerciseEquipmentResponse> {
        try {
            const id = uuidv4();
            const equipmentRef = ref(database, `exerciseEquipments/${id}`);
            
            const equipmentData: ExerciseEquipment = {
                ...data,
                id,
                createdAt: new Date().toISOString()
            };
            
            await set(equipmentRef, equipmentData);
            
            return {
                success: true,
                data: equipmentData
            };
        } catch (error) {
            console.error('Error creating exercise equipment:', error);
            return {
                success: false,
                errorMessage: 'Failed to create exercise equipment'
            };
        }
    }
}
