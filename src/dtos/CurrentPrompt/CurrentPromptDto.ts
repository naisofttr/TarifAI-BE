import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CurrentPromptDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    currentPrompts: string;
} 