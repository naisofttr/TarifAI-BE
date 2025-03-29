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
exports.CreateCustomerService = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
class CreateCustomerService {
    createCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = data.id;
            const customersRef = (0, database_2.ref)(database_1.database, `customers/${id}`);
            const customerData = Object.assign(Object.assign({}, data), { id });
            yield (0, database_2.set)(customersRef, customerData);
            return customerData;
        });
    }
}
exports.CreateCustomerService = CreateCustomerService;
