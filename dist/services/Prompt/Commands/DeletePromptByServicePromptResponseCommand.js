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
exports.DeletePromptByServicePromptResponseCommand = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class DeletePromptByServicePromptResponseCommand {
    execute(servicePromptResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promptsRef = (0, database_1.ref)(database_2.database, 'prompts');
                const promptQuery = (0, database_1.query)(promptsRef, (0, database_1.orderByChild)('servicePromptResponse'), (0, database_1.equalTo)(servicePromptResponse));
                const snapshot = yield (0, database_1.get)(promptQuery);
                if (!snapshot.exists()) {
                    return false;
                }
                // İlk eşleşen promptu bul ve sil
                const promptData = snapshot.val();
                const promptKey = Object.keys(promptData)[0];
                const promptRef = (0, database_1.ref)(database_2.database, `prompts/${promptKey}`);
                yield (0, database_1.remove)(promptRef);
                return true;
            }
            catch (error) {
                console.error('Prompt silinirken bir hata oluştu:', error);
                throw new Error('Prompt silinirken bir hata oluştu');
            }
        });
    }
}
exports.DeletePromptByServicePromptResponseCommand = DeletePromptByServicePromptResponseCommand;
