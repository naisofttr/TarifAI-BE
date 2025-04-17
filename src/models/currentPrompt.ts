import { PromptServiceType } from "../enums/PromptServiceType";

export interface CurrentPrompt {
    id: string;
    combinationId: string;
    languageCode: string;
    servicePromptResponse: string;
    confirmedCount: number;
    promptServiceType: PromptServiceType;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatedCurrentPromptResponse {
    success: boolean;
    data?: CurrentPrompt;
    errorMessage?: string;
} 