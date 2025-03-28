import { CustomerProfileDto } from "../dtos/CustomerProfile/customerProfileDto";

export interface Combination {
    id: string;
    customerProfileData: CustomerProfileDto;
    programType: 'calisthenics';                // Şu an için sadece calisthenics, ileride genişletilebilir
    createdAt: string;
    updatedAt?: string;
}

export interface CombinationResponse {
    success: boolean;
    data?: Combination;
    errorMessage?: string;
}

export interface CombinationListResponse {
    success: boolean;
    data?: Combination[];
    errorMessage?: string;
}
