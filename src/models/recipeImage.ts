export interface RecipeImage {
    id: string;
    type: string;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RecipeImageResponse {
    success: boolean;
    data?: RecipeImage;
    errorMessage?: string;
}

export interface RecipeImagesResponse {
    success: boolean;
    data?: RecipeImage[];
    errorMessage?: string;
}
