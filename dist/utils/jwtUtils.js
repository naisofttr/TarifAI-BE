"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCustomerIdFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const extractCustomerIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header geçersiz veya eksik');
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
    const jwtDecode = jsonwebtoken_1.default.verify(token, secretKey);
    return jwtDecode.id;
};
exports.extractCustomerIdFromToken = extractCustomerIdFromToken;
