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
exports.CreateCustomerProfileCommand = void 0;
const database_1 = require("firebase/database");
const uuid_1 = require("uuid");
const database_2 = require("../../../config/database");
class CreateCustomerProfileCommand {
    execute(customerId, data, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ID'ye göre kontrol et
                const profileRef = (0, database_1.ref)(database_2.database, `customerProfiles/${data.id || ''}`);
                const snapshot = yield (0, database_1.get)(profileRef);
                if (snapshot.exists()) {
                    return {
                        success: false,
                        errorMessage: 'A profile with this ID already exists'
                    };
                }
                // Yeni profil oluştur
                const id = data.id || (0, uuid_1.v4)();
                const newProfileRef = (0, database_1.ref)(database_2.database, `customerProfiles/${id}`);
                const profileData = Object.assign(Object.assign({}, data), { id,
                    customerId, name: '', age: 0, height: 0, weight: 0, gender: '', exerciseExperience: '', targetType: 'WEIGHT_LOSS', bodyType: 'ECTOMORPH', focusAreaType: [], formType: 'BEGINNER', howOftenExercise: 'ONE_TO_TWO', createdAt: new Date().toISOString() });
                yield (0, database_1.set)(newProfileRef, profileData);
                return {
                    success: true,
                    data: profileData,
                    errorMessage: 'Customer profile successfully created'
                };
            }
            catch (error) {
                console.error('Error creating customer profile:', error);
                return {
                    success: false,
                    errorMessage: 'Failed to create customer profile'
                };
            }
        });
    }
}
exports.CreateCustomerProfileCommand = CreateCustomerProfileCommand;
