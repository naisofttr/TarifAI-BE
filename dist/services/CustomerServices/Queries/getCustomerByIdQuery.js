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
exports.GetCustomerByIdQuery = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class GetCustomerByIdQuery {
    constructor() {
        this.CUSTOMERS_REF = 'customers';
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        errorMessage: 'Customer ID is required'
                    };
                }
                const customerQuery = (0, database_1.query)((0, database_1.ref)(database_2.database, this.CUSTOMERS_REF), (0, database_1.equalTo)(id));
                const snapshot = yield (0, database_1.get)(customerQuery);
                let customer = null;
                if (snapshot.exists()) {
                    const customerData = snapshot.val();
                    const customerKey = Object.keys(customerData)[0];
                    customer = customerData[customerKey];
                }
                if (!snapshot.exists()) {
                    return {
                        success: false,
                        errorMessage: 'Customer not found'
                    };
                }
                const customerData = snapshot.val();
                return {
                    success: true,
                    data: customerData
                };
            }
            catch (error) {
                console.error('Error getting customer by ID:', error);
                return {
                    success: false,
                    errorMessage: 'An error occurred while fetching the customer'
                };
            }
        });
    }
}
exports.GetCustomerByIdQuery = GetCustomerByIdQuery;
