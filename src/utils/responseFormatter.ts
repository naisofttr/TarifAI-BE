import { PromptServiceType } from '../enums/PromptServiceType';
import { PromptType } from '../enums/PromptType';

/**
 * API yanıtlarını standart formata dönüştüren yardımcı fonksiyon
 */
export const formatPromptResponse = (
    contentData: any,
    metadata: {
        combinationId?: string;
        promptServiceType: PromptServiceType;
        promptType: PromptType;
        languageCode: string;
        confirmedCount?: number;
        createdAt?: string;
        id?: string;
    }
) => {
    try {
        // Temel metadata değerlerini belirle
        const formattedResponse: any = {
            ...contentData,
            promptServiceType: metadata.promptServiceType,
            promptType: metadata.promptType,
            languageCode: metadata.languageCode,
            confirmedCount: metadata.confirmedCount || 0,
            createdAt: metadata.createdAt || new Date().toISOString(),
            id: metadata.id || ''
        };
        
        // combinationId varsa ekle
        if (metadata.combinationId) {
            formattedResponse.combinationId = metadata.combinationId;
        }
        
        return formattedResponse;
    } catch (error) {
        console.error('Error in formatPromptResponse:', error);
        const errorResponse: any = {
            error: 'Failed to format prompt response',
            promptServiceType: metadata.promptServiceType,
            promptType: metadata.promptType,
            languageCode: metadata.languageCode,
            confirmedCount: metadata.confirmedCount || 0,
            createdAt: metadata.createdAt || new Date().toISOString(),
            id: metadata.id || ''
        };
        
        // combinationId varsa ekle
        if (metadata.combinationId) {
            errorResponse.combinationId = metadata.combinationId;
        }
        
        return errorResponse;
    }
}; 