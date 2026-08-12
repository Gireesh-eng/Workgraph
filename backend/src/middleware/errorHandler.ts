import { Request, Response, NextFunction } from "express";

// Centralized error handler — every route benefits automatically via next(err)
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    // Neo4j connection failures get a specific 503 status
    const isDbError =
        err.code === "ServiceUnavailable" ||
        err.code === "SessionExpired" ||
        err.message?.includes("Could not perform discovery") ||
        err.message?.includes("connection") ||
        err.name === "Neo4jError";

    if (isDbError) {
        res.status(503).json({
            error: {
                message: "Database unavailable",
                code: "DB_UNAVAILABLE",
            },
        });
        return;
    }

    // Everything else is a generic 500
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({
        error: {
            message: err.message ?? "Something went wrong",
            code: err.code ?? "INTERNAL_ERROR",
        },
    });
}
