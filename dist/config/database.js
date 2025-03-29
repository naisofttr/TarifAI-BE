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
exports.initializeDatabase = exports.database = exports.firebaseApp = void 0;
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const firebase_config_1 = require("./firebase.config");
exports.firebaseApp = (0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
exports.database = (0, database_1.getDatabase)(exports.firebaseApp);
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Firebase bağlantısı başarılı');
        return exports.database;
    }
    catch (error) {
        console.error('Firebase bağlantı hatası:', error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
