import { DailyRoutineDto } from "./DailyRoutineDto";
import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CreateWeeklyRoutineDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    dailyRoutines: DailyRoutineDto[];
    goals: string;
    tips: string;
}
