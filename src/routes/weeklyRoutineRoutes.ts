import express from 'express';
import { WeeklyRoutineController } from '../controllers/weeklyRoutineController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const weeklyRoutineController = new WeeklyRoutineController();

router.post('/weeklyRoutine/get', verifyRefreshTokenMiddleware, (req, res) => weeklyRoutineController.getWeeklyRoutine(req, res));

export default router;
