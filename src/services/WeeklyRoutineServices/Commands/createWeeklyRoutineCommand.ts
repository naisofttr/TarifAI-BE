import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CreateWeeklyRoutineDto } from '../../../dtos/WeeklyRoutine/CreateWeeklyRoutineDto';
import { WeeklyRoutine } from '../../../models/weeklyRoutine';
import { v4 as uuidv4 } from 'uuid';

interface CreatedWeeklyRoutineResponse {
    success: boolean;
    data?: WeeklyRoutine;
    errorMessage?: string;
}

export class CreateWeeklyRoutineCommand {
    async execute(request: CreateWeeklyRoutineDto): Promise<CreatedWeeklyRoutineResponse> {
        try {
            const id = uuidv4();
            const routineRef = ref(database, `weeklyRoutines/${id}`);
            
            const weeklyRoutine: WeeklyRoutine = {
                id,
                combinationId: request.combinationId,
                promptServiceType: request.promptServiceType,
                confirmedCount: 0,
                dailyRoutines: request.dailyRoutines,
                goals: request.goals,
                tips: request.tips,
                createdAt: new Date().toISOString()
            };
            
            await set(routineRef, weeklyRoutine);
            
            return {
                success: true,
                data: weeklyRoutine,
                errorMessage: 'WeeklyRoutine successfully created'
            };
        } catch (error) {
            console.error('Error creating weekly routine:', error);
            return {
                success: false,
                errorMessage: 'Failed to create weekly routine'
            };
        }
    }
}
