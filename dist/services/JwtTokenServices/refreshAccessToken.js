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
exports.refreshAccessToken = void 0;
const generateJwtToken_1 = require("./generateJwtToken");
const refreshAccessToken = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // JWT token oluştur
        const payload = {
            id: id,
            email: email, // Kullanıcının e-posta adresi
        };
        const jwtToken = yield (0, generateJwtToken_1.generateJwtToken)(payload);
        return {
            refreshToken: jwtToken
        };
    }
    catch (error) {
        console.error('JWT token oluşturma hatası:', error);
        return null;
    }
});
exports.refreshAccessToken = refreshAccessToken;
