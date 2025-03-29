import { CreateCurrentPromptDto } from "../CurrentPrompt/CreateCurrentPromptDto";

export interface PromptResponse {
    data?: CreateCurrentPromptDto;
    message: string;
    confirmedCount?: number;
    error?: string;
    success: boolean;
}