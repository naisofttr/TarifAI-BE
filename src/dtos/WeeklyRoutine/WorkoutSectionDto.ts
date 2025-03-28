export interface WorkoutExerciseDto {
    name: string;                   // egzersiz adı
    sets?: number;                  // set sayısı
    reps?: string;                  // tekrar sayısı (örn: "5-8" veya "30 saniye")
    rest?: string;                  // dinlenme süresi
    notes?: string;                 // egzersizin açıklaması
    targetMuscles?: string;         // hedef kaslar (örn: "Göğüs ve kolları hedef alır")
    animationUrl: string;           // animasyon url
}

export interface WorkoutSectionDto {
    warmup: WorkoutExerciseDto[];           // Isınma hareketleri
    mainWorkout: WorkoutExerciseDto[];      // Ana antrenman hareketleri
    cooldown: WorkoutExerciseDto[];         // Soğuma hareketleri
}
