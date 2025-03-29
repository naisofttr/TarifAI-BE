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
exports.UploadExerciseMediaCommand = void 0;
const firebase_config_1 = require("../../../config/firebase.config");
const storage_1 = require("firebase/storage");
const uuid_1 = require("uuid");
class UploadExerciseMediaCommand {
    execute(files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = {};
                // Animasyon yükleme
                if (files.animation) {
                    const animationRef = (0, storage_1.ref)(firebase_config_1.storage, `exercises/animations/${(0, uuid_1.v4)()}.gif`);
                    yield (0, storage_1.uploadBytes)(animationRef, files.animation);
                    urls.animationUrl = yield (0, storage_1.getDownloadURL)(animationRef);
                }
                // Video yükleme
                if (files.video) {
                    const videoRef = (0, storage_1.ref)(firebase_config_1.storage, `exercises/videos/${(0, uuid_1.v4)()}.mp4`);
                    yield (0, storage_1.uploadBytes)(videoRef, files.video);
                    urls.videoUrl = yield (0, storage_1.getDownloadURL)(videoRef);
                }
                // Thumbnail yükleme
                if (files.thumbnail) {
                    const thumbnailRef = (0, storage_1.ref)(firebase_config_1.storage, `exercises/thumbnails/${(0, uuid_1.v4)()}.jpg`);
                    yield (0, storage_1.uploadBytes)(thumbnailRef, files.thumbnail);
                    urls.thumbnailUrl = yield (0, storage_1.getDownloadURL)(thumbnailRef);
                }
                return {
                    success: true,
                    data: urls
                };
            }
            catch (error) {
                console.error('Error uploading exercise media:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to upload exercise media'
                };
            }
        });
    }
}
exports.UploadExerciseMediaCommand = UploadExerciseMediaCommand;
