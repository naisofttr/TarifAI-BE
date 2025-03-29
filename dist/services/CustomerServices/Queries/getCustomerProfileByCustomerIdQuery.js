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
exports.GetCustomerProfileByCustomerIdQuery = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class GetCustomerProfileByCustomerIdQuery {
    execute(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profilesRef = (0, database_1.ref)(database_2.database, 'customerProfiles');
                const customerProfileQuery = (0, database_1.query)(profilesRef, (0, database_1.orderByChild)('customerId'), (0, database_1.equalTo)(customerId));
                const snapshot = yield (0, database_1.get)(customerProfileQuery);
                if (!snapshot.exists()) {
                    return {
                        success: false,
                        errorMessage: 'Customer profile not found'
                    };
                }
                let profileData = null;
                snapshot.forEach((childSnapshot) => {
                    profileData = childSnapshot.val();
                });
                if (!profileData) {
                    return {
                        success: false,
                        errorMessage: 'Customer profile not found'
                    };
                }
                return {
                    success: true,
                    data: profileData,
                    errorMessage: 'Customer profile found'
                };
            }
            catch (error) {
                console.error('Error getting customer profile:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to get customer profile'
                };
            }
        });
    }
}
exports.GetCustomerProfileByCustomerIdQuery = GetCustomerProfileByCustomerIdQuery;
