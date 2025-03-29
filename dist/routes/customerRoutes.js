"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const customerController = new customerController_1.CustomerController();
// Müşteri güncelleme endpoint'i
router.post('/customer/update', authMiddleware_1.verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomer(req, res));
// Müşteri profili endpoints
router.post('/customer/createCustomerProfile', (req, res) => customerController.createCustomerProfile(req, res)); // Token kontrolü yok
router.put('/customer/updateCustomerProfile', authMiddleware_1.verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomerProfile(req, res));
router.get('/customer/getCustomerProfile', authMiddleware_1.verifyRefreshTokenMiddleware, (req, res) => customerController.getCustomerProfile(req, res));
router.post('/customer/updateCustomerProfileById', authMiddleware_1.verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomerProfileById(req, res));
exports.default = router;
