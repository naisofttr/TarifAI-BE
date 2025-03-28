import express from 'express';
import { CustomerController } from '../controllers/customerController';
import { verifyRefreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const customerController = new CustomerController();

// Müşteri güncelleme endpoint'i
router.post('/customer/update', verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomer(req, res));

// Müşteri profili endpoints
router.post('/customer/createCustomerProfile', (req, res) => customerController.createCustomerProfile(req, res)); // Token kontrolü yok
router.put('/customer/updateCustomerProfile', verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomerProfile(req, res));
router.get('/customer/getCustomerProfile', verifyRefreshTokenMiddleware, (req, res) => customerController.getCustomerProfile(req, res));
router.post('/customer/updateCustomerProfileById', verifyRefreshTokenMiddleware, (req, res) => customerController.updateCustomerProfileById(req, res));

export default router;
