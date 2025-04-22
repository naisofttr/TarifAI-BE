import { CustomerProfileDto } from "../CustomerProfile/customerProfileDto";
import { PromptType } from "../../enums/PromptType";

export interface PromptRequest {
    prompt: CustomerProfileDto;
    languageCode: string;
    promptType?: PromptType;
}