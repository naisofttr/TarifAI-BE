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
exports.CreateCurrentPromptCommand = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
const uuid_1 = require("uuid");
class CreateCurrentPromptCommand {
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (0, uuid_1.v4)();
                const promptRef = (0, database_2.ref)(database_1.database, `currentPrompts/${id}`);
                const currentPrompt = {
                    combinationId: request.combinationId,
                    promptServiceType: request.promptServiceType,
                    currentPrompts: request.currentPrompts
                };
                yield (0, database_2.set)(promptRef, currentPrompt);
                return {
                    success: true,
                    data: currentPrompt,
                    errorMessage: 'Current prompt successfully created'
                };
            }
            catch (error) {
                console.error('Error creating current prompt:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to create current prompt'
                };
            }
        });
    }
}
exports.CreateCurrentPromptCommand = CreateCurrentPromptCommand;
