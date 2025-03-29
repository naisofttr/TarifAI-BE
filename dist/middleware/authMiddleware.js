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
exports.verifyRefreshTokenMiddleware = void 0;
const verifyRefreshToken_1 = require("../services/JwtTokenServices/verifyRefreshToken");
const verifyRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const isValid = yield (0, verifyRefreshToken_1.verifyRefreshToken)(token);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Token doğrulama hatası' });
    }
});
exports.verifyRefreshTokenMiddleware = verifyRefreshTokenMiddleware;
