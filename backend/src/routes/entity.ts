import { Router, Request, Response, NextFunction } from "express";
import { getEntityWithConnections } from "../db/queries";

const router = Router();

router.get("/:type/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await getEntityWithConnections(id);

        if (!result) {
            res.status(404).json({
                error: {
                    message: "Not found",
                    code: "NOT_FOUND",
                },
            });
            return;
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
