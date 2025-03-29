import { Request, Response } from 'express';
import { GetCurrentPromptQuery } from '../services/CurrentPromptServices/Queries/getCurrentPromptQuery';

export class CurrentPromptController {
    private getCurrentPromptQuery: GetCurrentPromptQuery;

    constructor() {
        this.getCurrentPromptQuery = new GetCurrentPromptQuery();
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
}
