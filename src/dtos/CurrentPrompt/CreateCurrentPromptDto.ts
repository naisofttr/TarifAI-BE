import { PromptServiceType } from "../../enums/PromptServiceType";

export interface CreateCurrentPromptDto {
    combinationId: string;
    promptServiceType: PromptServiceType;
    currentPrompts: string;
}
