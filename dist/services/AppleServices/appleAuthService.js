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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleAuthService = void 0;
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
class AppleAuthService {
    constructor() {
        var _a;
        this.clientId = process.env.APPLE_CLIENT_ID || '';
        this.teamId = process.env.APPLE_TEAM_ID || '';
        this.keyId = process.env.APPLE_KEY_ID || '';
        this.privateKey = ((_a = process.env.APPLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || '';
        if (!this.clientId || !this.teamId || !this.keyId || !this.privateKey) {
            throw new Error('Apple kimlik doğrulama bilgileri eksik');
        }
    }
    verifyAppleToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const redirectUri = process.env.APPLE_REDIRECT_URI;
                if (!redirectUri) {
                    throw new Error('APPLE_REDIRECT_URI is not defined');
                }
                const tokenResponse = yield apple_signin_auth_1.default.getAuthorizationToken(request.IdToken, {
                    clientID: this.clientId,
                    clientSecret: this.generateClientSecret(),
                    redirectUri: redirectUri,
                });
                // ID token'ı doğrula ve kullanıcı bilgilerini al
                const data = yield apple_signin_auth_1.default.verifyIdToken(tokenResponse.id_token, {
                    audience: this.clientId,
                    ignoreExpiration: true,
                });
                return {
                    id: data.sub,
                    email: data.email
                };
            }
            catch (error) {
                console.error('Apple token doğrulama hatası:', error);
                return null;
            }
        });
    }
    generateClientSecret() {
        return apple_signin_auth_1.default.getClientSecret({
            clientID: this.clientId,
            teamID: this.teamId,
            keyIdentifier: this.keyId,
            privateKey: this.privateKey,
        });
    }
    refreshAppleToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenResponse = yield apple_signin_auth_1.default.refreshAuthorizationToken(refreshToken, {
                    clientID: this.clientId,
                    clientSecret: this.generateClientSecret()
                });
                if (!tokenResponse.access_token) {
                    return null;
                }
                return {
                    refreshToken: tokenResponse.refresh_token || refreshToken
                };
            }
            catch (error) {
                console.error('Apple refresh token hatası:', error);
                return null;
            }
        });
    }
}
exports.AppleAuthService = AppleAuthService;
