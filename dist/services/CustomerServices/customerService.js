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
exports.CustomerService = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../config/database");
const refreshAccessToken_1 = require("../JwtTokenServices/refreshAccessToken");
const MembershipType_1 = require("../../enums/MembershipType");
const createCustomerService_1 = require("./Commands/createCustomerService");
const updateCustomerService_1 = require("./Commands/updateCustomerService");
const uuid_1 = require("uuid");
class CustomerService {
    constructor() {
        this.CUSTOMERS_REF = 'customers';
        this.createCustomerService = new createCustomerService_1.CreateCustomerService();
        this.updateCustomerService = new updateCustomerService_1.UpdateCustomerService();
    }
    handleCustomerService(email_1, name_1, profilePhotoUrl_1, clientDate_1) {
        return __awaiter(this, arguments, void 0, function* (email, name, profilePhotoUrl, clientDate, membershipType = MembershipType_1.MembershipType.FREE) {
            try {
                // Email'e göre customer ara
                const customerQuery = (0, database_1.query)((0, database_1.ref)(database_2.database, this.CUSTOMERS_REF), (0, database_1.orderByChild)('email'), (0, database_1.equalTo)(email));
                const snapshot = yield (0, database_1.get)(customerQuery);
                let customer = null;
                let id = (0, uuid_1.v4)();
                if (snapshot.exists()) {
                    const customerData = snapshot.val();
                    const customerKey = Object.keys(customerData)[0];
                    customer = customerData[customerKey];
                    id = (customer === null || customer === void 0 ? void 0 : customer.id) || id;
                }
                // Refresh token işlemleri
                const tokenInfo = yield (0, refreshAccessToken_1.refreshAccessToken)(id, email);
                if (!tokenInfo) {
                    return {
                        success: false,
                        errorMessage: 'Refresh token alınamadı'
                    };
                }
                // clientDate'e 100 gün ekle
                const refreshTokenExpiryDate = new Date(clientDate);
                refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 100);
                let customerData;
                if (customer) {
                    // Mevcut Müşteriyi Güncelle
                    customer.name = name;
                    customer.refreshToken = tokenInfo.refreshToken;
                    customer.membershipType = membershipType;
                    customer.updatedAt = clientDate;
                    customer.refreshTokenExpiryDate = refreshTokenExpiryDate.toISOString(),
                        customer.membershipType = membershipType,
                        yield this.updateCustomerService.execute(customer);
                    customerData = customer;
                    console.log('Customer updated successfully.');
                }
                else {
                    // Yeni müşteri oluştur
                    const expiryDate = refreshTokenExpiryDate.toISOString();
                    customerData = yield this.createCustomerService.createCustomer({
                        id,
                        email,
                        name,
                        profilePhotoUrl,
                        refreshToken: tokenInfo.refreshToken,
                        refreshTokenExpiryDate: expiryDate,
                        membershipType,
                        createdAt: clientDate
                    });
                }
                return {
                    success: true,
                    data: customerData
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return {
                    success: false,
                    errorMessage
                };
            }
        });
    }
}
exports.CustomerService = CustomerService;
