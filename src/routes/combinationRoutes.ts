import express from 'express';
import { CombinationController } from '../controllers/combinationController';

const router = express.Router();
const combinationController = new CombinationController();

router.post('/combination/create', (req, res) => combinationController.createCombination(req, res));

export default router; 