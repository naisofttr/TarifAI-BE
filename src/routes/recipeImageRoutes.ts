import express, { Request, Response } from 'express';
import multer from 'multer';
import { CreateRecipeImageCommand } from '../services/RecipeImageServices/Commands/createRecipeImageCommand';

const router = express.Router();

// En basit multer konfigürasyonu
const upload = multer({ 
  storage: multer.memoryStorage()
});

// Tarif görseli oluşturma endpoint'i
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Dosya kontrolü
    if (!req.file) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Görsel dosyası gereklidir'
      });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Tarif tipi gereklidir'
      });
    }

    // Görsel oluşturma servisini çağır
    const createRecipeImageCommand = new CreateRecipeImageCommand();
    const result = await createRecipeImageCommand.execute(type, req.file);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Recipe image route error:', error);
    return res.status(500).json({
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
    });
  }
});

export default router;
