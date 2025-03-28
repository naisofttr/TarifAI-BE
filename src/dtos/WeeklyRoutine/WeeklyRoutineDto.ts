import { DailyRoutineDto } from "./DailyRoutineDto";

export interface WeeklyRoutineDto {
    dailyRoutines: DailyRoutineDto[];           // günlük rutinler
    goals: string;                              // haftanın neye odaklanacagini tanımlar
    tips: string;                               // öneri ipuçları   
}