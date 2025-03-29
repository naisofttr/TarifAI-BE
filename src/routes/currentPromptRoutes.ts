import express from 'express';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';
import { CurrentPromptController } from '../controllers/currentPromptController';

const router = express.Router();
const currentPromptController = new CurrentPromptController();

router.post('/currentPrompt/get', verifyRefreshTokenMiddleware, (req, res) => currentPromptController.getCurrentPrompt(req, res));

export default router;
