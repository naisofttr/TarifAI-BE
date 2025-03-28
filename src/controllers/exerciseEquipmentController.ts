import { Request, Response } from 'express';
import { CreateExerciseEquipmentCommand } from '../services/ExerciseEquipmentServices/Commands/createExerciseEquipmentCommand';
import { UpdateExerciseEquipmentCommand } from '../services/ExerciseEquipmentServices/Commands/updateExerciseEquipmentCommand';
import { DeleteExerciseEquipmentCommand } from '../services/ExerciseEquipmentServices/Commands/deleteExerciseEquipmentCommand';
import { GetAllExerciseEquipmentsQuery } from '../services/ExerciseEquipmentServices/Queries/getAllExerciseEquipmentsQuery';

export class ExerciseEquipmentController {
    private createExerciseEquipmentCommand: CreateExerciseEquipmentCommand;
    private updateExerciseEquipmentCommand: UpdateExerciseEquipmentCommand;
    private deleteExerciseEquipmentCommand: DeleteExerciseEquipmentCommand;
    private getAllExerciseEquipmentsQuery: GetAllExerciseEquipmentsQuery;

    constructor() {
        this.createExerciseEquipmentCommand = new CreateExerciseEquipmentCommand();
        this.updateExerciseEquipmentCommand = new UpdateExerciseEquipmentCommand();
        this.deleteExerciseEquipmentCommand = new DeleteExerciseEquipmentCommand();
        this.getAllExerciseEquipmentsQuery = new GetAllExerciseEquipmentsQuery();
    }

    async createExerciseEquipment(req: Request, res: Response) {
        try {
            const equipmentData = req.body;
            const result = await this.createExerciseEquipmentCommand.execute(equipmentData);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage || 'Ekipman oluşturulamadı.'
                });
            }

            return res.status(201).json({
                success: true,
                data: result.data,
                message: 'Ekipman başarıyla oluşturuldu'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async updateExerciseEquipment(req: Request, res: Response) {
        try {
            const { id, ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Ekipman ID gereklidir.'
                });
            }

            const result = await this.updateExerciseEquipmentCommand.execute(id, updateData);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage || 'Ekipman güncellenemedi.'
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: 'Ekipman başarıyla güncellendi'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async deleteExerciseEquipment(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Ekipman ID gereklidir.'
                });
            }

            const result = await this.deleteExerciseEquipmentCommand.execute(id);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage || 'Ekipman silinemedi.'
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: 'Ekipman başarıyla silindi'
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
            return res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    async getAllExerciseEquipments(req: Request, res: Response) {
        try {
            const result = await this.getAllExerciseEquipmentsQuery.execute();

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage || 'Ekipmanlar getirilemedi.'
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                message: 'Ekipmanlar başarıyla getirildi'
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
