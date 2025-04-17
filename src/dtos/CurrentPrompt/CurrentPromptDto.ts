import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CurrentPromptDto {
    combinationId: string;
    servicePromptResponse: string;
    promptServiceType: PromptServiceType;
} 