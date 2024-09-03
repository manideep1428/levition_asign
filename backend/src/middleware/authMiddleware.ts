import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const authSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(1, 'Password is required')
});



export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response<any> | void => {
    const { name, password } = req.body;

    const result = authSchema.safeParse({ name, password });

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors.map(err => err.message).join(', ') });
    }

    next();
};
