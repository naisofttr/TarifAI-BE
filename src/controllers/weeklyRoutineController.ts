import { Request, Response } from 'express';
import { GetWeeklyRoutineQuery } from '../services/WeeklyRoutineServices/Queries/getWeeklyRoutineQuery';

export class WeeklyRoutineController {
    private getWeeklyRoutineQuery: GetWeeklyRoutineQuery;

    constructor() {
        this.getWeeklyRoutineQuery = new GetWeeklyRoutineQuery();
    }

    async getWeeklyRoutine(req: Request, res: Response) {
        try {
            const result = await this.getWeeklyRoutineQuery.execute(req);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                errorMessage: 'An error occurred while getting weekly routine'
            });
        }
    }
}
