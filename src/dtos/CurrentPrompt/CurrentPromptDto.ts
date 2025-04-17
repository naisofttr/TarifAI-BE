import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CurrentPromptDto {
    combinationId: string;
    languageCode: string;
    servicePromptResponse: string;
    promptServiceType: PromptServiceType;
} 