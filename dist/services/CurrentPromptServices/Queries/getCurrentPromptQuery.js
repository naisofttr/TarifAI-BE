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
exports.GetCurrentPromptQuery = void 0;
const database_1 = require("firebase/database");
const createCombinationCommand_1 = require("../../CombinationServices/Commands/createCombinationCommand");
const GetPromptService_1 = require("../../Prompt/Queries/GetPromptService");
const database_2 = require("../../../config/database");
class GetCurrentPromptQuery {
    execute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { profileData, combinationId } = req.body;
                // Önce mevcut prompt'u kontrol et
                const promptRef = (0, database_1.ref)(database_2.database, `currentPrompts/${combinationId}`);
                const promptSnapshot = yield (0, database_1.get)(promptRef);
                if (promptSnapshot.exists()) {
                    return {
                        success: true,
                        data: promptSnapshot.val(),
                        errorMessage: 'Current prompt found in database',
                        combinationId: combinationId
                    };
                }
                // Eğer mevcut değilse, yeni bir combination ve prompt oluştur
                const createCombinationCommand = new createCombinationCommand_1.CreateCombinationCommand();
                const combinationResult = yield createCombinationCommand.execute(profileData);
                const combinationResultMessage = combinationResult.errorMessage;
                let promptResultMessage = '';
                if (combinationResult.success && ((_a = combinationResult.data) === null || _a === void 0 ? void 0 : _a.customerProfileData)) {
                    // Send to GetPromptService
                    const getPromptService = new GetPromptService_1.GetPromptService();
                    const promptRequest = {
                        prompt: combinationResult.data.customerProfileData,
                        languageCode: req.body.languageCode
                    };
                    const promptResponse = yield getPromptService.getPromptResponse(promptRequest, req, combinationResult.data.id);
                    promptResultMessage = promptResponse.message;
                    if (promptResponse.success) {
                        return {
                            success: true,
                            data: promptResponse.data,
                            errorMessage: 'Current prompt successfully created,' + combinationResultMessage + ',' + promptResultMessage,
                            combinationId: combinationResult.data.id
                        };
                    }
                }
                return {
                    success: false,
                    errorMessage: 'Failed to create current prompt,' + combinationResultMessage + ',' + promptResultMessage
                };
            }
            catch (error) {
                console.error('Error in GetCurrentPromptQuery:', error);
                return {
                    success: false,
                    errorMessage: error instanceof Error ? error.message : 'Unexpected error occurred'
                };
            }
        });
    }
}
exports.GetCurrentPromptQuery = GetCurrentPromptQuery;
