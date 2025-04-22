import { PromptServiceType } from "../../enums/PromptServiceType";
import { PromptType } from "../../enums/PromptType";

export interface CurrentPromptArrayItemDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    servicePromptResponse: string;
    promptType: PromptType;
}

export interface CreateCurrentPromptArrayDto {
    data: CurrentPromptArrayItemDto[];
} 