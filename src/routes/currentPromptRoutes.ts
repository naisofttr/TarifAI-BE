import express from 'express';
import { CurrentPromptController } from '../controllers/currentPromptController';

const router = express.Router();
const currentPromptController = new CurrentPromptController();

router.post('/currentPrompt/getCurrentPrompt', (req, res) => currentPromptController.getCurrentPrompt(req, res));
router.post('/currentPrompt/createCurrentPromptArray', (req, res) => currentPromptController.createCurrentPromptArray(req, res));

export default router;
