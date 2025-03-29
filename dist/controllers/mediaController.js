"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const uploadExerciseMediaCommand_1 = require("../services/MediaServices/Commands/uploadExerciseMediaCommand");
class MediaController {
    constructor() {
        this.uploadExerciseMediaCommand = new uploadExerciseMediaCommand_1.UploadExerciseMediaCommand();
    }
    uploadExerciseMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                if (!req.files) {
                    return res.status(400).json({
                        success: false,
                        message: 'Dosya yüklenmedi'
                    });
                }
                const files = req.files;
                const mediaFiles = {
                    animation: (_b = (_a = files.animation) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.buffer,
                    video: (_d = (_c = files.video) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.buffer,
                    thumbnail: (_f = (_e = files.thumbnail) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.buffer
                };
                const result = yield this.uploadExerciseMediaCommand.execute(mediaFiles);
                if (!result.success) {
                    return res.status(400).json({
                        success: false,
                        message: result.errorMessage || 'Medya yüklenemedi'
                    });
                }
                return res.status(201).json({
                    success: true,
                    data: result.data,
                    message: 'Medya başarıyla yüklendi'
                });
            }
            catch (error) {
                console.error('Error in uploadExerciseMedia:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Medya yüklenirken bir hata oluştu'
                });
            }
        });
    }
}
exports.MediaController = MediaController;
