import express from 'express';
import { ExerciseEquipmentController } from '../controllers/exerciseEquipmentController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const exerciseEquipmentController = new ExerciseEquipmentController();

// Ekipman CRUD endpoints
router.post('/equipment/create', verifyRefreshTokenMiddleware, (req, res) => exerciseEquipmentController.createExerciseEquipment(req, res));
router.put('/equipment/update', verifyRefreshTokenMiddleware, (req, res) => exerciseEquipmentController.updateExerciseEquipment(req, res));
router.delete('/equipment/delete/:id', verifyRefreshTokenMiddleware, (req, res) => exerciseEquipmentController.deleteExerciseEquipment(req, res));
router.get('/equipment/all', verifyRefreshTokenMiddleware, (req, res) => exerciseEquipmentController.getAllExerciseEquipments(req, res));

export default router;
