import { Router, Request, Response, NextFunction } from "express";
import { getStats } from "../db/queries";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await getStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
});

export default router;
