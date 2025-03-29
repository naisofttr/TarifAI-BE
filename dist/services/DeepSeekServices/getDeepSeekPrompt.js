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
exports.getDeepSeekPrompt = void 0;
const openai_1 = __importDefault(require("openai"));
const promptContentGenerator_1 = require("../../utils/promptContentGenerator");
const getDeepSeekPrompt = (endpoint, apiKey, languageCode, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generatedPrompt = (0, promptContentGenerator_1.generatePromptContent)(languageCode, prompt);
        const openai = new openai_1.default({
            baseURL: endpoint,
            apiKey: apiKey
        });
        const response = yield openai.chat.completions.create({
            messages: [{ role: "system", content: generatedPrompt }],
            model: "deepseek-chat",
        });
        return response;
    }
    catch (error) {
        console.error('Error fetching DeepSeek prompt:', error);
        // throw error;
    }
});
exports.getDeepSeekPrompt = getDeepSeekPrompt;
