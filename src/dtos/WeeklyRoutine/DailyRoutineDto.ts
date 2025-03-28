import { WorkoutSectionDto } from "./WorkoutSectionDto";

export interface DailyRoutineDto {
    duration: string;                   // günlük antrenman süresi (örn: 30-40 dakika/gün)
    workout: WorkoutSectionDto;         // günün antrenman programı
}
