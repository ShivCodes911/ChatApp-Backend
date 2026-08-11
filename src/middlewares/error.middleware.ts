import type { Request,Response,NextFunction } from "express";

export const errorMiddleware=(
    error:unknown,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    console.error(error);
    return res.status(500).json({
        status:false,
        message:"Internal Server Error"
    });
};