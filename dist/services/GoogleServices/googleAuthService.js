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
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
class GoogleAuthService {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client();
    }
    getClientId(platform) {
        const clientId = process.env[`GOOGLE_CLIENT_ID_${platform}`];
        if (!clientId) {
            throw new Error(`GOOGLE_CLIENT_ID_${platform} is not defined in environment variables`);
        }
        return clientId;
    }
    verifyGoogleToken(token, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = this.getClientId(platform);
                const ticket = yield this.client.verifyIdToken({
                    idToken: token,
                    audience: clientId
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    console.error('Token payload is empty');
                    return false;
                }
                console.log('Token verification payload:', payload);
                return true;
            }
            catch (error) {
                console.error('Google token doğrulama detaylı hata:', error);
                return false;
            }
        });
    }
}
exports.GoogleAuthService = GoogleAuthService;
