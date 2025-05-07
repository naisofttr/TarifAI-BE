import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CreateRecipeImageCommand } from '../services/RecipeImageServices/Commands/createRecipeImageCommand';

const router = express.Router();

/**
 * Multer konfigürasyonu
 * Görsel dosyalarını belleğe yükler
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Sadece görsel dosyalarını kabul et
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece görsel dosyaları yüklenebilir'));
    }
  }
}).single('file');

/**
 * Multer hata yönetimi middleware'i
 */
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      errorMessage: `Dosya yükleme hatası: ${err.message}`
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      errorMessage: err.message
    });
  }
  next();
};

/**
 * Tarif görseli oluşturma endpoint'i
 * @route POST /api/recipe-images
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err) => {
    // Multer hatası kontrolü
    if (err) {
      return res.status(400).json({
        success: false,
        errorMessage: err instanceof multer.MulterError 
          ? `Dosya yükleme hatası: ${err.message}` 
          : err.message
      });
    }
    
    // Gerekli alanların kontrolü
    const { type } = req.body;
    const file = req.file;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Tarif tipi gereklidir'
      });
    }
    
    if (!file) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Görsel dosyası gereklidir'
      });
    }

    try {
      // Görsel oluşturma servisini çağır
      const createRecipeImageCommand = new CreateRecipeImageCommand();
      const result = await createRecipeImageCommand.execute(type, file);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Tarif görseli oluşturma hatası:', error);
      return res.status(500).json({
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      });
    }
  });
});

export default router;
