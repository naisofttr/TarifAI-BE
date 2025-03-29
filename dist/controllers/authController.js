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
exports.AuthController = void 0;
const loginService_1 = require("../services/loginService");
const MembershipType_1 = require("../enums/MembershipType");
class AuthController {
    constructor() {
        this.loginService = new loginService_1.LoginService();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { IdToken, ClientDate, Email, Name, ProfilePhotoUrl, LoginType: loginType, MembershipType: membershipType, Platform } = req.body;
                if (!IdToken || !ClientDate || !Email || !Name || !loginType || !Platform) {
                    return res.status(400).json({
                        success: false,
                        message: 'IdToken, ClientDate, Email, Name, LoginType ve Platform zorunlu alanlardır'
                    });
                }
                const customerData = {
                    IdToken,
                    Email,
                    Name,
                    ProfilePhotoUrl,
                    ClientDate,
                    MembershipType: membershipType || MembershipType_1.MembershipType.FREE,
                    Platform
                };
                const result = yield this.loginService.handleLogin(customerData, loginType);
                if (!result.success) {
                    return res.status(400).json({
                        success: false,
                        message: result.errorMessage
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Giriş başarılı'
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Giriş işlemi sırasında bir hata oluştu',
                    error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
