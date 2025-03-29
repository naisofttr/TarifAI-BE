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
exports.CreatePromptCommand = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
const uuid_1 = require("uuid");
class CreatePromptCommand {
    execute(createPromptDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const promptsRef = (0, database_2.ref)(database_1.database, `prompts/${id}`);
            const promptData = Object.assign(Object.assign({}, createPromptDto), { customerId: createPromptDto.customerId, id, confirmedCount: 0, promptServiceType: createPromptDto.promptServiceType });
            yield (0, database_2.set)(promptsRef, promptData);
            return promptData;
        });
    }
}
exports.CreatePromptCommand = CreatePromptCommand;
