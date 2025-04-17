import { Request, Response } from 'express';
import { CreateCombinationCommand } from '../services/CombinationServices/Commands/createCombinationCommand';
import { CreateCombinationArrayCommand } from '../services/CombinationServices/Commands/createCombinationArrayCommand';
import { CombinationArrayRequestDto } from '../dtos/Ingredients/ingredient-request.dto';

export class CombinationController {
    private createCombinationCommand: CreateCombinationCommand;
    private createCombinationArrayCommand: CreateCombinationArrayCommand;

    constructor() {
        this.createCombinationCommand = new CreateCombinationCommand();
        this.createCombinationArrayCommand = new CreateCombinationArrayCommand();
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

    async createCombinationArray(req: Request, res: Response) {
        try {
            // Request body'sinin doğru formatta olduğundan emin oluyoruz
            const combinationRequest: CombinationArrayRequestDto = {
                combinations: req.body
            };
            
            const result = await this.createCombinationArrayCommand.execute(combinationRequest);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('Error in createCombinationArray:', error);
            return res.status(500).json({
                success: false,
                errorMessage: 'An error occurred while creating combination array'
            });
        }
    }
} 