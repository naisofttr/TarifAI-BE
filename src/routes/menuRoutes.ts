import express from 'express';
import { MenuController } from '../controllers/menuController';

const router = express.Router();
const menuController = new MenuController();

// GET menus by menu type and language code
router.get('/getMenusByMenuType/:menuPromptType/:languageCode', (req, res) => 
    menuController.getMenusByMenuType(req, res)
);

// POST create single menu
router.post('/create', (req, res) => 
    menuController.createMenu(req, res)
);

// POST create multiple menus
router.post('/createMultiple', (req, res) => 
    menuController.createMenus(req, res)
);

export default router; 