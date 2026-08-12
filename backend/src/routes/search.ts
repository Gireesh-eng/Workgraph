import { Router, Request, Response, NextFunction } from "express";
import { searchAll } from "../db/queries";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req.query.q as string) ?? "";

        // Empty query is a valid state, not an error
        if (!query.trim()) {
            res.json({ results: [] });
            return;
        }

        const results = await searchAll(query.trim());
        res.json({ results });
    } catch (err) {
        next(err);
    }
});

export default router;
