import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CurrentPromptArrayItemDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    servicePromptResponse: string;
}

export interface CreateCurrentPromptArrayDto {
    data: CurrentPromptArrayItemDto[];
} 