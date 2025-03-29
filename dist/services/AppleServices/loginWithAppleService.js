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
exports.LoginWithAppleService = void 0;
const customerService_1 = require("../CustomerServices/customerService");
const appleAuthService_1 = require("./appleAuthService");
class LoginWithAppleService {
    constructor() {
        this.appleAuthService = new appleAuthService_1.AppleAuthService();
        this.customerService = new customerService_1.CustomerService();
    }
    loginWithApple(customerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appleUser = yield this.appleAuthService.verifyAppleToken(customerData);
                if (!appleUser || !appleUser.email || !customerData.Name) {
                    return {
                        success: false,
                        errorMessage: 'Geçersiz Apple Token'
                    };
                }
                return yield this.customerService.handleCustomerService(appleUser.email, customerData.Name, customerData.ProfilePhotoUrl || '', customerData.ClientDate, customerData.MembershipType);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return {
                    success: false,
                    errorMessage: `Apple ile müşteri oluşturulurken bir hata oluştu: ${errorMessage}`
                };
            }
        });
    }
}
exports.LoginWithAppleService = LoginWithAppleService;
