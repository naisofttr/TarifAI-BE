"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promptController_1 = require("../controllers/promptController");
const router = express_1.default.Router();
const promptController = new promptController_1.PromptController();
// router.post('/prompt/getPrompt', verifyRefreshTokenMiddleware, (req, res) => promptController.getPrompt(req, res));
// router.post('/prompt/deletePromptByServicePromptResponse', verifyRefreshTokenMiddleware, (req, res) => promptController.deletePromptByServicePromptResponse(req, res)); 
// router.get('/prompt/getCustomerPrompts', verifyRefreshTokenMiddleware, (req, res) => promptController.getCustomerPrompts(req, res));
// router.post('/prompt/updatePromptConfirmedCount', verifyRefreshTokenMiddleware, (req, res) => promptController.updatePromptConfirmedCount(req, res));
exports.default = router;
