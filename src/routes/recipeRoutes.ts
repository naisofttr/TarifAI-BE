import express from 'express';
import * as recipeController from '../controllers/recipeController';

const router = express.Router();

/**
 * @route GET /api/recipes/:recipeId
 * @description Belirtilen ID'ye sahip tarifin detaylarını getirir
 * @access Public
 */
router.get('/:recipeId', (req, res) => 
    recipeController.getRecipeDetail(req, res)
);

// POST create new recipe
router.post('/', (req, res) => 
    recipeController.createRecipe(req, res)
);

export default router;