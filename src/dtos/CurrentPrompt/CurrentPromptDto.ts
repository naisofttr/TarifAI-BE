import { PromptServiceType } from "../../enums/PromptServiceType";
import { PromptType } from "../../enums/PromptType";

export interface CurrentPromptDto {
    combinationId: string;
    languageCode: string;
    servicePromptResponse: string;
    promptServiceType: PromptServiceType;
    promptType: PromptType;
} 