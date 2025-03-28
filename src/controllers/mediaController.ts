import { Request, Response } from 'express';
import { UploadExerciseMediaCommand } from '../services/MediaServices/Commands/uploadExerciseMediaCommand';

export class MediaController {
    private uploadExerciseMediaCommand: UploadExerciseMediaCommand;

    constructor() {
        this.uploadExerciseMediaCommand = new UploadExerciseMediaCommand();
    }

    async uploadExerciseMedia(req: Request, res: Response) {
        try {
            if (!req.files) {
                return res.status(400).json({
                    success: false,
                    message: 'Dosya yüklenmedi'
                });
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            const mediaFiles = {
                animation: files.animation?.[0]?.buffer,
                video: files.video?.[0]?.buffer,
                thumbnail: files.thumbnail?.[0]?.buffer
            };

            const result = await this.uploadExerciseMediaCommand.execute(mediaFiles);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errorMessage || 'Medya yüklenemedi'
                });
            }

            return res.status(201).json({
                success: true,
                data: result.data,
                message: 'Medya başarıyla yüklendi'
            });

        } catch (error) {
            console.error('Error in uploadExerciseMedia:', error);
            return res.status(500).json({
                success: false,
                message: 'Medya yüklenirken bir hata oluştu'
            });
        }
    }
}
