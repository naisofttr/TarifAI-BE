import express from 'express';
import { MenuController } from '../controllers/menuController';

const router = express.Router();
const menuController = new MenuController();

// GET menus by menu type and language code
router.get('/getMenusByMenuType/:menuPromptType/:languageCode', (req, res) => 
    menuController.getMenusByMenuType(req, res)
);

export default router; 