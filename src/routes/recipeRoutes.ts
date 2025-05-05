import express from 'express';
import { getRecipeDetail } from '../controllers/recipeController';

const router = express.Router();

/**
 * @route GET /api/recipes/:recipeId
 * @description Belirtilen ID'ye sahip tarifin detaylarını getirir
 * @access Public
 */
router.get('/:recipeId', getRecipeDetail);

export default router;