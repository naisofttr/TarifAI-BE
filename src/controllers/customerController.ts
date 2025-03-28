import { Request, Response } from 'express';
import { UpdateCustomerService } from '../services/CustomerServices/Commands/updateCustomerService';
import { extractCustomerIdFromToken } from '../utils/jwtUtils';
import { GetCustomerByIdQuery } from '../services/CustomerServices/Queries/getCustomerByIdQuery';
import { CreateCustomerProfileCommand } from '../services/CustomerServices/Commands/createCustomerProfileCommand';
import { UpdateCustomerProfileCommand } from '../services/CustomerServices/Commands/updateCustomerProfileCommand';
import { GetCustomerProfileByCustomerIdQuery } from '../services/CustomerServices/Queries/getCustomerProfileByCustomerIdQuery';
import { UpdateCustomerProfileByIdCommand } from '../services/CustomerServices/Commands/UpdateCustomerProfileByIdCommand';

export class CustomerController {
    private updateCustomerService: UpdateCustomerService;
    private getCustomerByIdQuery: GetCustomerByIdQuery;
    private createCustomerProfileCommand: CreateCustomerProfileCommand;
    private updateCustomerProfileCommand: UpdateCustomerProfileCommand;
    private getCustomerProfileQuery: GetCustomerProfileByCustomerIdQuery;
    private updateCustomerProfileByIdCommand: UpdateCustomerProfileByIdCommand;

    constructor() {
        this.updateCustomerService = new UpdateCustomerService();
        this.getCustomerByIdQuery = new GetCustomerByIdQuery();
        this.createCustomerProfileCommand = new CreateCustomerProfileCommand();
        this.updateCustomerProfileCommand = new UpdateCustomerProfileCommand();
        this.getCustomerProfileQuery = new GetCustomerProfileByCustomerIdQuery();
        this.updateCustomerProfileByIdCommand = new UpdateCustomerProfileByIdCommand();
    }

    async updateCustomer(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);

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
            const updatedCustomer = await this.updateCustomerService.execute({
                ...req.body
            });

            return res.status(200).json({
                success: true,
                data: updatedCustomer,
                message: 'Müşteri başarıyla güncellendi'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: `Müşteri güncellenirken bir hata oluştu: ${errorMessage}`
            });
        }
    }

    async createCustomerProfile(req: Request, res: Response) {
        try {
            const profileData = req.body;
            
            // Henüz customer oluşturulmadığı için customerid yi empty string gönderiyoruz
            const result = await this.createCustomerProfileCommand.execute('', profileData, req);

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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async updateCustomerProfile(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }

            const result = await this.updateCustomerProfileCommand.execute(customerId, req.body);

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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async getCustomerProfile(req: Request, res: Response) {
        try {
            const customerId = extractCustomerIdFromToken(req);

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token.'
                });
            }

            const result = await this.getCustomerProfileQuery.execute(customerId);

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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async updateCustomerProfileById(req: Request, res: Response) {
        try {
            const { id, ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Profile ID gereklidir.'
                });
            }

            const result = await this.updateCustomerProfileByIdCommand.execute(id, updateData);

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

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }
}
