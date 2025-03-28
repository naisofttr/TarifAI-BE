import express from 'express';
import multer from 'multer';
import { MediaController } from '../controllers/mediaController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const mediaController = new MediaController();

// Multer yapılandırması
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'animation') {
            if (!file.mimetype.startsWith('image/gif')) {
                return cb(new Error('Sadece GIF formatı kabul edilir'));
            }
        } else if (file.fieldname === 'video') {
            if (!file.mimetype.startsWith('video/')) {
                return cb(new Error('Geçersiz video formatı'));
            }
        } else if (file.fieldname === 'thumbnail') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Geçersiz resim formatı'));
            }
        }
        cb(null, true);
    }
});

// Medya yükleme endpoint'i
router.post('/media/exercise/upload',
    verifyRefreshTokenMiddleware,
    upload.fields([
        { name: 'animation', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    (req, res) => mediaController.uploadExerciseMedia(req, res)
);

export default router;
