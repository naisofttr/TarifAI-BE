"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const currentPromptController_1 = require("../controllers/currentPromptController");
const router = express_1.default.Router();
const currentPromptController = new currentPromptController_1.CurrentPromptController();
router.post('/currentPrompt/get', authMiddleware_1.verifyRefreshTokenMiddleware, (req, res) => currentPromptController.getCurrentPrompt(req, res));
exports.default = router;
