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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatGptPrompt = void 0;
const axios_1 = __importDefault(require("axios"));
const promptContentGenerator_1 = require("../../utils/promptContentGenerator");
const getChatGptPrompt = (endpoint, apiKey, languageCode, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(endpoint, {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: (0, promptContentGenerator_1.generatePromptContent)(languageCode, prompt)
            }
        ],
        max_tokens: 2500,
        temperature: 0.7
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
});
exports.getChatGptPrompt = getChatGptPrompt;
