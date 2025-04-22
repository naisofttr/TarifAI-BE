import { PromptServiceType } from "../enums/PromptServiceType";
import { PromptType } from "../enums/PromptType";

export interface CurrentPrompt {
    id: string;
    combinationId: string;
    languageCode: string;
    servicePromptResponse: string;
    confirmedCount: number;
    promptServiceType: PromptServiceType;
    promptType: PromptType;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatedCurrentPromptResponse {
    success: boolean;
    data?: CurrentPrompt;
    errorMessage?: string;
} 