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
exports.GetCombinationQuery = void 0;
const database_1 = require("firebase/database");
const database_2 = require("../../../config/database");
class GetCombinationQuery {
    execute(profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const combinationsRef = (0, database_1.ref)(database_2.database, 'combinations');
                const combinationQuery = (0, database_1.query)(combinationsRef, (0, database_1.orderByChild)('customerProfileData/exerciseExperience'), (0, database_1.equalTo)(profileData.exerciseExperience));
                const snapshot = yield (0, database_1.get)(combinationQuery);
                if (!snapshot.exists()) {
                    return {
                        success: true,
                        data: [],
                        errorMessage: 'No combinations found'
                    };
                }
                const combinations = [];
                snapshot.forEach((childSnapshot) => {
                    combinations.push(childSnapshot.val());
                });
                return {
                    success: true,
                    data: combinations,
                    errorMessage: 'Combinations found'
                };
            }
            catch (error) {
                console.error('Error getting combinations:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to get combinations'
                };
            }
        });
    }
}
exports.GetCombinationQuery = GetCombinationQuery;
