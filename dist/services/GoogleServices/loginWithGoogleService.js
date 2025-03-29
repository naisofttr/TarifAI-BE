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
exports.LoginWithGoogleService = void 0;
const googleAuthService_1 = require("./googleAuthService");
const customerService_1 = require("../CustomerServices/customerService");
class LoginWithGoogleService {
    constructor() {
        this.googleAuthService = new googleAuthService_1.GoogleAuthService();
        this.customerService = new customerService_1.CustomerService();
    }
    validateGoogleToken(idToken, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.googleAuthService.verifyGoogleToken(idToken, platform);
        });
    }
    loginWithGoogle(customerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Google token'ı doğrula
                const isValidToken = yield this.validateGoogleToken(customerData.IdToken, customerData.Platform);
                if (!isValidToken) {
                    return {
                        success: false,
                        errorMessage: 'Geçersiz Google Token'
                    };
                }
                return yield this.customerService.handleCustomerService(customerData.Email, customerData.Name, (customerData.ProfilePhotoUrl || ''), customerData.ClientDate, customerData.MembershipType);
            }
            catch (error) {
                // Hata durumunda uygun mesajı döndür
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return {
                    success: false,
                    errorMessage: `Müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
                };
            }
        });
    }
}
exports.LoginWithGoogleService = LoginWithGoogleService;
