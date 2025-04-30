import { PromptServiceType } from '../enums/PromptServiceType';
import { PromptType } from '../enums/PromptType';

/**
 * API yanıtlarını standart formata dönüştüren yardımcı fonksiyon
 */
export const formatPromptResponse = (
    contentData: any,
    metadata: {
        combinationId: string;
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
        const formattedResponse = {
            ...contentData,
            combinationId: metadata.combinationId,
            promptServiceType: metadata.promptServiceType,
            promptType: metadata.promptType,
            languageCode: metadata.languageCode,
            confirmedCount: metadata.confirmedCount || 0,
            createdAt: metadata.createdAt || new Date().toISOString(),
            id: metadata.id || ''
        };
        
        return formattedResponse;
    } catch (error) {
        console.error('Error in formatPromptResponse:', error);
        return {
            error: 'Failed to format prompt response',
            combinationId: metadata.combinationId,
            promptServiceType: metadata.promptServiceType,
            promptType: metadata.promptType,
            languageCode: metadata.languageCode,
            confirmedCount: metadata.confirmedCount || 0,
            createdAt: metadata.createdAt || new Date().toISOString(),
            id: metadata.id || ''
        };
    }
}; 