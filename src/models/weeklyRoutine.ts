import { PromptServiceType } from "../enums/PromptServiceType";
import { DailyRoutineDto } from "../dtos/WeeklyRoutine/DailyRoutineDto";

export interface WeeklyRoutine {
    id: string;
    combinationId: string;
    promptServiceType: PromptServiceType;
    confirmedCount: number;
        
    dailyRoutines: DailyRoutineDto[];           // günlük rutinler
    goals: string;                              // haftanın neye odaklanacagini tanımlar
    tips: string;                               // öneri ipuçları

    createdAt?: string;
    updatedAt?: string;
}
