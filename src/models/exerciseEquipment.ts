export interface ExerciseEquipment {
    id: string;
    name: string;           // malzeme adı (örn: dumbell, barfiks demiri)
    weight?: number;        // kg (opsiyonel, bazı ekipmanlarda kg olmayabilir)
    quantity: number;       // adet
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatedExerciseEquipmentResponse {
    success: boolean;
    data?: ExerciseEquipment;
    errorMessage?: string;
}

export interface ExerciseEquipmentListResponse {
    success: boolean;
    data?: ExerciseEquipment[];
    errorMessage?: string;
}
