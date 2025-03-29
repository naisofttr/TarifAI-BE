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
exports.UpdatePromptConfirmedCountCommand = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class UpdatePromptConfirmedCountCommand {
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promptsRef = (0, database_1.ref)(database_2.database, 'prompts');
                // servicePromptResponse'a göre prompt'u bul
                const promptQuery = (0, database_1.query)(promptsRef, (0, database_1.orderByChild)('servicePromptResponse'), (0, database_1.equalTo)(request.servicePromptResponse));
                const snapshot = yield (0, database_1.get)(promptQuery);
                if (!snapshot.exists()) {
                    throw new Error('Prompt bulunamadı');
                }
                // İlk eşleşen prompt'u al
                const [promptId, promptData] = Object.entries(snapshot.val())[0];
                // confirmedCount'u güncelle
                const updates = {
                    [`/prompts/${promptId}/confirmedCount`]: request.confirmedCount
                };
                yield (0, database_1.update)((0, database_1.ref)(database_2.database), updates);
            }
            catch (error) {
                console.error('UpdatePromptConfirmedCountCommand error:', error);
                throw error;
            }
        });
    }
}
exports.UpdatePromptConfirmedCountCommand = UpdatePromptConfirmedCountCommand;
