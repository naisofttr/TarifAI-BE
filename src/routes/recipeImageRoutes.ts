import express from 'express';
import { recipeImageController } from '../controllers/recipeImageController';

const router = express.Router();

// Tarif görseli oluşturma endpoint'i
router.post('/', recipeImageController.createRecipeImage);

export default router;
