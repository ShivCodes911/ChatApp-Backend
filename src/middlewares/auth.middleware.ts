import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import type { Request, Response, NextFunction } from "express";

interface DecodedToken extends jwt.JwtPayload {
    userId: string;
}

export const userAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Invalid authorization header"
            });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;

        if (!secret) {
            throw new Error("Env is missing");
        }

        const decodedToken = jwt.verify(
            token,
            secret
        ) as DecodedToken;

        const user = await userModel.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        req.user = {
            userId: decodedToken.userId
        };

        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid Token or Token Expired"
        });
    }
};