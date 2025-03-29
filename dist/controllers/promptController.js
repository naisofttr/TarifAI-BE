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
exports.PromptController = void 0;
const GetPromptService_1 = require("../services/Prompt/Queries/GetPromptService");
const DeletePromptByServicePromptResponseCommand_1 = require("../services/Prompt/Commands/DeletePromptByServicePromptResponseCommand");
const GetCustomerPromptsQuery_1 = require("../services/Prompt/Queries/GetCustomerPromptsQuery");
const UpdatePromptConfirmedCountCommand_1 = require("../services/Prompt/Commands/UpdatePromptConfirmedCountCommand");
const jwtUtils_1 = require("../utils/jwtUtils");
class PromptController {
    constructor() {
        this.promptService = new GetPromptService_1.GetPromptService();
        this.deletePromptCommand = new DeletePromptByServicePromptResponseCommand_1.DeletePromptByServicePromptResponseCommand();
        this.getCustomerPromptsQuery = new GetCustomerPromptsQuery_1.GetCustomerPromptsQuery();
        this.updatePromptConfirmedCountCommand = new UpdatePromptConfirmedCountCommand_1.UpdatePromptConfirmedCountCommand();
    }
    deletePromptByServicePromptResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { servicePromptResponse } = req.body;
                if (!servicePromptResponse) {
                    return res.status(400).json({
                        success: false,
                        message: 'servicePromptResponse parametresi zorunludur'
                    });
                }
                const isDeleted = yield this.deletePromptCommand.execute(servicePromptResponse);
                if (!isDeleted) {
                    return res.status(404).json({
                        success: false,
                        message: 'Silinecek prompt bulunamadı'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Prompt başarıyla silindi'
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Prompt silinirken bir hata oluştu'
                });
            }
        });
    }
    getCustomerPrompts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = (0, jwtUtils_1.extractCustomerIdFromToken)(req);
                const prompts = yield this.getCustomerPromptsQuery.execute(customerId);
                res.status(200).json(prompts);
            }
            catch (error) {
                console.error('Müşteri promptları getirme hatası:', error);
                res.status(500).json({
                    error: 'Müşteri promptları getirilirken bir hata oluştu',
                    details: error instanceof Error ? error.message : 'Bilinmeyen hata'
                });
            }
        });
    }
    updatePromptConfirmedCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { servicePromptResponse, confirmedCount } = req.body;
                if (!servicePromptResponse || confirmedCount === undefined) {
                    return res.status(400).json({
                        success: false,
                        message: 'servicePromptResponse ve confirmedCount zorunlu alanlardır'
                    });
                }
                yield this.updatePromptConfirmedCountCommand.execute({
                    servicePromptResponse,
                    confirmedCount
                });
                return res.status(200).json({
                    success: true,
                    message: 'Prompt confirmed count başarıyla güncellendi'
                });
            }
            catch (error) {
                console.error('UpdatePromptConfirmedCount error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Prompt confirmed count güncellenirken bir hata oluştu',
                    error: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu'
                });
            }
        });
    }
}
exports.PromptController = PromptController;
