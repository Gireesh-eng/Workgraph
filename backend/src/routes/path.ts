import { Router, Request, Response, NextFunction } from "express";
import { findShortestPath, getAllNodes } from "../db/queries";

const router = Router();

// Get shortest path between two nodes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const from = req.query.from as string;
        const to = req.query.to as string;

        if (!from || !to) {
            res.status(400).json({
                error: {
                    message: "Both 'from' and 'to' query parameters are required",
                    code: "BAD_REQUEST",
                },
            });
            return;
        }

        const result = await findShortestPath(from, to);

        if (!result) {
            res.json({ path: [] });
            return;
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Get all nodes for the path finder dropdowns
router.get("/nodes", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const nodes = await getAllNodes();
        res.json({ nodes });
    } catch (err) {
        next(err);
    }
});

export default router;
