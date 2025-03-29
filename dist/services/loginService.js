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
exports.LoginService = void 0;
const loginWithGoogleService_1 = require("./GoogleServices/loginWithGoogleService");
const loginWithAppleService_1 = require("./AppleServices/loginWithAppleService");
const loginType_1 = require("../enums/loginType");
class LoginService {
    constructor() {
        this.loginWithGoogleService = new loginWithGoogleService_1.LoginWithGoogleService();
        this.loginWithAppleService = new loginWithAppleService_1.LoginWithAppleService();
    }
    handleLogin(customerData, loginType) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (loginType) {
                case loginType_1.LoginType.GOOGLE:
                    return yield this.loginWithGoogleService.loginWithGoogle(customerData);
                case loginType_1.LoginType.APPLE:
                    return yield this.loginWithAppleService.loginWithApple(customerData);
                case loginType_1.LoginType.EMAIL:
                    // Şimdilik EMAIL için bir işlem yapmıyoruz
                    return {
                        success: false,
                        errorMessage: 'EMAIL login henüz desteklenmiyor'
                    };
                default:
                    return {
                        success: false,
                        errorMessage: 'Desteklenmeyen LoginType'
                    };
            }
        });
    }
}
exports.LoginService = LoginService;
