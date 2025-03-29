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
exports.UpdateCustomerService = void 0;
const database_1 = require("../../../config/database");
const database_2 = require("firebase/database");
class UpdateCustomerService {
    execute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerRef = (0, database_2.ref)(database_1.database, 'customers');
                // id'a göre customer'u bul
                const customerQuery = (0, database_2.query)(customerRef, (0, database_2.orderByChild)('id'), (0, database_2.equalTo)(req.id));
                const snapshot = yield (0, database_2.get)(customerQuery);
                if (!snapshot.exists()) {
                    throw new Error('Customer bulunamadı');
                }
                const customerKey = Object.keys(snapshot.val())[0];
                const existingCustomer = snapshot.val()[customerKey];
                // Tüm alanları güncelle
                const updates = {
                    [`/customers/${req.id}`]: Object.assign(Object.assign(Object.assign({}, existingCustomer), req), { updatedAt: new Date().toISOString() })
                };
                yield (0, database_2.update)((0, database_2.ref)(database_1.database), updates);
            }
            catch (error) {
                console.error('Error updating customer:', error);
                throw error;
            }
        });
    }
}
exports.UpdateCustomerService = UpdateCustomerService;
