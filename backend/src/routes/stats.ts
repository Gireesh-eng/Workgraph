import { Router, Request, Response, NextFunction } from "express";
import { getStats } from "../db/queries";

const router = Router();

let cachedStats: any = null;
let lastFetch = 0;

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = Date.now();
        if (cachedStats && now - lastFetch < 60000) {
            return res.json(cachedStats);
        }
        const stats = await getStats();
        cachedStats = stats;
        lastFetch = now;
        res.json(stats);
    } catch (err) {
        next(err);
    }
});

export default router;
