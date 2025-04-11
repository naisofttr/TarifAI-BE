import { Request, Response } from 'express';
import { CreateCombinationCommand } from '../services/CombinationServices/Commands/createCombinationCommand';

export class CombinationController {
    private createCombinationCommand: CreateCombinationCommand;

    constructor() {
        this.createCombinationCommand = new CreateCombinationCommand();
    }

    async createCombination(req: Request, res: Response) {
        try {
            const result = await this.createCombinationCommand.execute(req.body);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                errorMessage: 'An error occurred while creating combination'
            });
        }
    }
} 