import { Request, Response } from 'express';
import { GetCurrentPromptQuery } from '../services/CurrentPromptServices/Queries/getCurrentPromptQuery';
import { CreateCurrentPromptArrayCommand } from '../services/CurrentPromptServices/Commands/createCurrentPromptArrayCommand';

export class CurrentPromptController {
    private getCurrentPromptQuery: GetCurrentPromptQuery;
    private createCurrentPromptArrayCommand: CreateCurrentPromptArrayCommand;

    constructor() {
        this.getCurrentPromptQuery = new GetCurrentPromptQuery();
        this.createCurrentPromptArrayCommand = new CreateCurrentPromptArrayCommand();
    }

    async getCurrentPrompt(req: Request, res: Response) {
        try {
            const result = await this.getCurrentPromptQuery.execute(req);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                errorMessage: 'An error occurred while getting current prompt'
            });
        }
    }

    async createCurrentPromptArray(req: Request, res: Response) {
        try {
            const result = await this.createCurrentPromptArrayCommand.execute(req.body);
            return res.status(result.success ? 201 : 400).json(result);
        } catch (error) {
            console.error('Current prompt array oluşturma hatası:', error);
            return res.status(500).json({
                success: false,
                errorMessage: 'Toplu current prompt oluşturma sırasında bir hata oluştu'
            });
        }
    }
}
