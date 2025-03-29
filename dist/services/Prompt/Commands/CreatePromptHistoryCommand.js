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
exports.CreatePromptHistoryCommand = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
const uuid_1 = require("uuid");
class CreatePromptHistoryCommand {
    execute(createPromptHistoryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const promptHistoryRef = (0, database_2.ref)(database_1.database, `promptHistory/${id}`);
            const promptHistoryData = Object.assign(Object.assign({}, createPromptHistoryDto), { id, createdAt: new Date().toISOString(), updatedAt: null });
            yield (0, database_2.set)(promptHistoryRef, promptHistoryData);
            return promptHistoryData;
        });
    }
}
exports.CreatePromptHistoryCommand = CreatePromptHistoryCommand;
