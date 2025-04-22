import { database } from '../../../config/database';
import { ref, set } from 'firebase/database';
import { CurrentPromptDto } from '../../../dtos/CurrentPrompt/CurrentPromptDto';
import { CurrentPrompt, CreatedCurrentPromptResponse } from '../../../models/currentPrompt';
import { v4 as uuidv4 } from 'uuid';
import { PromptServiceType } from '../../../enums/PromptServiceType';
import { CreateCurrentPromptArrayDto, CurrentPromptArrayItemDto } from '../../../dtos/CurrentPrompt/CreateCurrentPromptArrayDto';
import { PromptType } from '../../../enums/PromptType';

export class CreateCurrentPromptArrayCommand {
    async execute(request: CreateCurrentPromptArrayDto | any[]): Promise<CreatedCurrentPromptResponse> {
        try {
            const results: CurrentPrompt[] = [];
            
            // Input validation and normalization
            let dataItems: CurrentPromptArrayItemDto[] = [];
            
            if (Array.isArray(request)) {
                // Her öğe { data: { ... } } şeklinde geldiği için data alanını çıkarıyoruz
                dataItems = request.map(item => {
                    if (item && item.data) {
                        const data = item.data;
                        
                        // promptType değeri string olarak geldiyse enum'a dönüştürüyoruz
                        let promptTypeValue = PromptType.Recipe; // Varsayılan değer
                        
                        if (data.promptType !== undefined) {
                            if (typeof data.promptType === 'string') {
                                const promptTypeLower = data.promptType.toLowerCase();
                                if (promptTypeLower === 'recipe') {
                                    promptTypeValue = PromptType.Recipe;
                                } else if (promptTypeLower === 'menu') {
                                    promptTypeValue = PromptType.Menu;
                                }
                            } else if (typeof data.promptType === 'number') {
                                promptTypeValue = data.promptType;
                            }
                        }
                        
                        return {
                            combinationId: data.combinationId,
                            promptServiceType: data.promptServiceType,
                            servicePromptResponse: data.servicePromptResponse,
                            promptType: promptTypeValue
                        };
                    }
                    
                    // Eski format destekleniyor (doğrudan array içinde gelen veri)
                    return {
                        combinationId: item.combinationId,
                        promptServiceType: item.promptServiceType,
                        servicePromptResponse: item.servicePromptResponse,
                        promptType: this.convertToPromptTypeEnum(item.promptType)
                    };
                });
            } else if (request && request.data && Array.isArray(request.data)) {
                // CreateCurrentPromptArrayDto formatında gelen istek
                dataItems = request.data.map(item => ({
                    ...item,
                    promptType: this.convertToPromptTypeEnum(item.promptType)
                }));
            } else {
                return {
                    success: false,
                    errorMessage: 'Geçersiz istek formatı. Array veya data property içinde array olmalıdır.'
                };
            }
            
            for (const item of dataItems) {
                const currentPromptDto: CurrentPromptDto = {
                    combinationId: item.combinationId,
                    languageCode: 'tr', // Varsayılan dil kodu
                    servicePromptResponse: item.servicePromptResponse,
                    promptServiceType: item.promptServiceType,
                    promptType: item.promptType
                };
                
                const id = uuidv4();
                const promptRef = ref(database, `currentPrompts/${id}`);
                
                const currentPrompt: CurrentPrompt = {
                    id,
                    combinationId: currentPromptDto.combinationId,
                    languageCode: currentPromptDto.languageCode,
                    servicePromptResponse: currentPromptDto.servicePromptResponse,
                    promptServiceType: currentPromptDto.promptServiceType,
                    promptType: currentPromptDto.promptType,
                    confirmedCount: 0,
                    createdAt: new Date().toISOString()
                };
                
                await set(promptRef, currentPrompt);
                results.push(currentPrompt);
            }
            
            return {
                success: true,
                data: results.length > 0 ? results[0] : undefined,
                errorMessage: `${results.length} adet current prompt başarıyla oluşturuldu`
            };
        } catch (error) {
            console.error('Toplu current prompt oluşturma hatası:', error);
            return {
                success: false,
                errorMessage: 'Toplu current prompt oluşturma işlemi başarısız oldu'
            };
        }
    }
    
    // String veya number promptType değerini PromptType enum değerine dönüştürür
    private convertToPromptTypeEnum(promptType: any): PromptType {
        if (promptType === undefined) {
            return PromptType.Recipe; // Varsayılan değer
        }
        
        if (typeof promptType === 'string') {
            const promptTypeLower = promptType.toLowerCase();
            if (promptTypeLower === 'recipe') {
                return PromptType.Recipe;
            } else if (promptTypeLower === 'menu') {
                return PromptType.Menu;
            }
        } else if (typeof promptType === 'number') {
            // number değeri enum sınırları içindeyse kullan
            if (promptType === PromptType.Recipe || promptType === PromptType.Menu) {
                return promptType;
            }
        }
        
        return PromptType.Recipe; // Varsayılan değer
    }
} 