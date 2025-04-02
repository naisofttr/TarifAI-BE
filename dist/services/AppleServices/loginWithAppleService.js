"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWithAppleService = void 0;
// import { CustomerService } from "../CustomerServices/customerService";
const appleAuthService_1 = require("./appleAuthService");
class LoginWithAppleService {
    // private customerService: CustomerService;
    constructor() {
        this.appleAuthService = new appleAuthService_1.AppleAuthService();
        // this.customerService = new CustomerService();
    }
}
exports.LoginWithAppleService = LoginWithAppleService;
