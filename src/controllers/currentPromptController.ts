import { Request, Response } from 'express';
import { GetCurrentPromptQuery } from '../services/CurrentPromptServices/Queries/getCurrentPromptQuery';
import { CreateCurrentPromptArrayCommand } from '../services/CurrentPromptServices/Commands/createCurrentPromptArrayCommand';
import { CreateCurrentPromptCommand } from '../services/CurrentPromptServices/Commands/createCurrentPromptCommand';

export class CurrentPromptController {
    private getCurrentPromptQuery: GetCurrentPromptQuery;
    private createCurrentPromptCommand: CreateCurrentPromptCommand;
    private createCurrentPromptArrayCommand: CreateCurrentPromptArrayCommand;

    constructor() {
        this.getCurrentPromptQuery = new GetCurrentPromptQuery();
        this.createCurrentPromptCommand = new CreateCurrentPromptCommand();
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
            return res.status(500).json({
                success: false,
                errorMessage: 'Toplu current prompt oluşturma sırasında bir hata oluştu'
            });
        }
    }
}
