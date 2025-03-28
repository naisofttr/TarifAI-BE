import { WeeklyRoutineDto } from "../WeeklyRoutine/WeeklyRoutineDto";

export interface PromptResponse {
    data?: WeeklyRoutineDto;
    message: string;
    confirmedCount?: number;
    error?: string;
    success: boolean;
}