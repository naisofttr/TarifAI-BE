import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CurrentPromptArrayItemDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    currentPrompts: string;
}

export interface CreateCurrentPromptArrayDto {
    data: CurrentPromptArrayItemDto[];
} 