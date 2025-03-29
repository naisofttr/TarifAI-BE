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
exports.UpdateCustomerProfileByIdCommand = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class UpdateCustomerProfileByIdCommand {
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileRef = (0, database_1.ref)(database_2.database, `customerProfiles/${id}`);
                const snapshot = yield (0, database_1.get)(profileRef);
                if (!snapshot.exists()) {
                    return {
                        success: false,
                        errorMessage: 'Profile not found'
                    };
                }
                const existingProfile = snapshot.val();
                const updates = {
                    [`customerProfiles/${id}`]: Object.assign(Object.assign(Object.assign({}, existingProfile), data), { updatedAt: new Date().toISOString() })
                };
                yield (0, database_1.update)((0, database_1.ref)(database_2.database), updates);
                // Güncellenmiş profili al ve döndür
                const updatedSnapshot = yield (0, database_1.get)(profileRef);
                const updatedProfile = updatedSnapshot.val();
                return {
                    success: true,
                    data: updatedProfile
                };
            }
            catch (error) {
                console.error('Error updating customer profile:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to update customer profile'
                };
            }
        });
    }
}
exports.UpdateCustomerProfileByIdCommand = UpdateCustomerProfileByIdCommand;
