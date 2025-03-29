"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomerPromptsQuery = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
class GetCustomerPromptsQuery {
    execute(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promptsRef = (0, database_2.ref)(database_1.database, 'promptHistory');
                // Önce customerId'ye göre filtrele
                const customerPromptsQuery = (0, database_2.query)(promptsRef, (0, database_2.orderByChild)('customerId'), (0, database_2.equalTo)(customerId));
                const snapshot = yield (0, database_2.get)(customerPromptsQuery);
                if (!snapshot.exists()) {
                    return [];
                }
                // Tüm promptları al ve createdAt'e göre sırala
                const allPrompts = Object.values(snapshot.val());
                // En yeniden en eskiye doğru sırala
                const sortedPrompts = allPrompts.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                return sortedPrompts.map(prompt => ({
                    text: prompt.text,
                    servicePromptResponse: prompt.servicePromptResponse
                }));
            }
            catch (error) {
                console.error('Prompts getirme hatası:', error);
                throw error;
            }
        });
    }
}
exports.GetCustomerPromptsQuery = GetCustomerPromptsQuery;
