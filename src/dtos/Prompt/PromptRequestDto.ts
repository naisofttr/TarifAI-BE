import { CustomerProfileDto } from "../CustomerProfile/customerProfileDto";

export interface PromptRequest {
    prompt: CustomerProfileDto;
    languageCode: string;
}