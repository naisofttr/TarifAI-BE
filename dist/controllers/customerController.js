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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const updateCustomerService_1 = require("../services/CustomerServices/Commands/updateCustomerService");
const jwtUtils_1 = require("../utils/jwtUtils");
const getCustomerByIdQuery_1 = require("../services/CustomerServices/Queries/getCustomerByIdQuery");
const createCustomerProfileCommand_1 = require("../services/CustomerServices/Commands/createCustomerProfileCommand");
const updateCustomerProfileCommand_1 = require("../services/CustomerServices/Commands/updateCustomerProfileCommand");
const getCustomerProfileByCustomerIdQuery_1 = require("../services/CustomerServices/Queries/getCustomerProfileByCustomerIdQuery");
const UpdateCustomerProfileByIdCommand_1 = require("../services/CustomerServices/Commands/UpdateCustomerProfileByIdCommand");
class CustomerController {
    constructor() {
        this.updateCustomerService = new updateCustomerService_1.UpdateCustomerService();
        this.getCustomerByIdQuery = new getCustomerByIdQuery_1.GetCustomerByIdQuery();
        this.createCustomerProfileCommand = new createCustomerProfileCommand_1.CreateCustomerProfileCommand();
        this.updateCustomerProfileCommand = new updateCustomerProfileCommand_1.UpdateCustomerProfileCommand();
        this.getCustomerProfileQuery = new getCustomerProfileByCustomerIdQuery_1.GetCustomerProfileByCustomerIdQuery();
        this.updateCustomerProfileByIdCommand = new UpdateCustomerProfileByIdCommand_1.UpdateCustomerProfileByIdCommand();
    }
    updateCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = (0, jwtUtils_1.extractCustomerIdFromToken)(req);
                // Validate input
                if (!customerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Geçersiz token.'
                    });
                }
                // Get customer by ID
                // const customerResponse = await this.getCustomerByIdQuery.execute(customerId);
                // if (!customerResponse.success) {
                //     return res.status(404).json({
                //         success: false,
                //         message: customerResponse.errorMessage || 'Müşteri bulunamadı.'
                //     });
                // }
                req.body.id = customerId;
                // Update customer using service
                const updatedCustomer = yield this.updateCustomerService.execute(Object.assign({}, req.body));
                return res.status(200).json({
                    success: true,
                    data: updatedCustomer,
                    message: 'Müşteri başarıyla güncellendi'
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return res.status(500).json({
                    success: false,
                    message: `Müşteri güncellenirken bir hata oluştu: ${errorMessage}`
                });
            }
        });
    }
    createCustomerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = req.body;
                // Henüz customer oluşturulmadığı için customerid yi empty string gönderiyoruz
                const result = yield this.createCustomerProfileCommand.execute('', profileData, req);
                if (!result.success) {
                    return res.status(400).json({
                        success: false,
                        message: result.errorMessage || 'Profil oluşturulamadı.'
                    });
                }
                return res.status(201).json({
                    success: true,
                    data: result.data,
                    message: result.errorMessage
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return res.status(500).json({
                    success: false,
                    message: errorMessage
                });
            }
        });
    }
    updateCustomerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = (0, jwtUtils_1.extractCustomerIdFromToken)(req);
                if (!customerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Geçersiz token.'
                    });
                }
                const result = yield this.updateCustomerProfileCommand.execute(customerId, req.body);
                if (!result.success) {
                    return res.status(400).json({
                        success: false,
                        message: result.errorMessage || 'Profil güncellenemedi.'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Müşteri profili başarıyla güncellendi'
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return res.status(500).json({
                    success: false,
                    message: errorMessage
                });
            }
        });
    }
    getCustomerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = (0, jwtUtils_1.extractCustomerIdFromToken)(req);
                if (!customerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Geçersiz token.'
                    });
                }
                const result = yield this.getCustomerProfileQuery.execute(customerId);
                if (!result.success) {
                    return res.status(404).json({
                        success: false,
                        message: result.errorMessage || 'Profil bulunamadı.'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Müşteri profili başarıyla getirildi'
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return res.status(500).json({
                    success: false,
                    message: errorMessage
                });
            }
        });
    }
    updateCustomerProfileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { id } = _a, updateData = __rest(_a, ["id"]);
                if (!id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Profile ID gereklidir.'
                    });
                }
                const result = yield this.updateCustomerProfileByIdCommand.execute(id, updateData);
                if (!result.success) {
                    return res.status(400).json({
                        success: false,
                        message: result.errorMessage || 'Profil güncellenemedi.'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: result.data,
                    message: 'Müşteri profili başarıyla güncellendi'
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
                return res.status(500).json({
                    success: false,
                    message: errorMessage
                });
            }
        });
    }
}
exports.CustomerController = CustomerController;
