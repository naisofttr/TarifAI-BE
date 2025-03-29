"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const mediaController_1 = require("../controllers/mediaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const mediaController = new mediaController_1.MediaController();
// Multer yapılandırması
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'animation') {
            if (!file.mimetype.startsWith('image/gif')) {
                return cb(new Error('Sadece GIF formatı kabul edilir'));
            }
        }
        else if (file.fieldname === 'video') {
            if (!file.mimetype.startsWith('video/')) {
                return cb(new Error('Geçersiz video formatı'));
            }
        }
        else if (file.fieldname === 'thumbnail') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Geçersiz resim formatı'));
            }
        }
        cb(null, true);
    }
});
// Medya yükleme endpoint'i
router.post('/media/exercise/upload', authMiddleware_1.verifyRefreshTokenMiddleware, upload.fields([
    { name: 'animation', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), (req, res) => mediaController.uploadExerciseMedia(req, res));
exports.default = router;
