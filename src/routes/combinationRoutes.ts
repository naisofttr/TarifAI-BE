import express from 'express';
import { CombinationController } from '../controllers/combinationController';

const router = express.Router();
const combinationController = new CombinationController();

router.post('/combination/create', (req, res) => combinationController.createCombination(req, res));
router.post('/combination/createArray', (req, res) => combinationController.createCombinationArray(req, res));

export default router; 