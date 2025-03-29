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
exports.CurrentPromptController = void 0;
const getCurrentPromptQuery_1 = require("../services/CurrentPromptServices/Queries/getCurrentPromptQuery");
class CurrentPromptController {
    constructor() {
        this.getCurrentPromptQuery = new getCurrentPromptQuery_1.GetCurrentPromptQuery();
    }
    getCurrentPrompt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getCurrentPromptQuery.execute(req);
                return res.status(result.success ? 200 : 400).json(result);
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    errorMessage: 'An error occurred while getting current prompt'
                });
            }
        });
    }
}
exports.CurrentPromptController = CurrentPromptController;
