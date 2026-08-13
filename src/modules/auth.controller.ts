import type { NextFunction, Request,Response } from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { signinSchema, signupSchema } from "../validation/user.validation.js";


// /api/v1/auth/signup
export const signup=async(req:Request , res:Response ,next:NextFunction)=>{
    try {

        const validationResult= await signupSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:validationResult.error
            })
        };


        const {name , email , password}=validationResult.data;

        const existingUser = await userModel.findOne({
            email:email
        });

        if(existingUser){
            return res.status(400).json({
                status:false,
                message:"User already exists"
            })
        }
            // hashing password before saving 
        const hashedPassword = await bcrypt.hash(password,10);

        // save user 

        const newUser=await userModel.create({
            name,
            email,
            password:hashedPassword
        });

        

        if(!process.env.ACCESS_TOKEN_SECRET){
            throw new Error("Environment variable not found")
        }
        
        const accessToken= jwt.sign({userId:newUser._id,name,email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2d'});


        return res.status(200).json({
            status:true,
            message:"Signup Successfull",
            user:{
                userId:newUser._id,
                name,
                email
            },
            accessToken
            
        });
} catch (error) {
   next(error);
     }
};


// /api/v1/auth/signin
export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationResult = await signinSchema.safeParseAsync(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                status: false,
                message: "Enter proper details"
            });
        }

        const { email, password } = validationResult.data;

        const existingUser = await userModel.findOne({ email });

        // Same status + same message for both "no user" and "wrong password"
        if (!existingUser) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchedPassword) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("Env Error");
        }

        const accessToken = jwt.sign(
            { userId: existingUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "2d" }   // matches signup's expiry now
        );

        return res.status(200).json({
            status: true,
            message: "Signed In Successfully",
            user: {
                userId: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            },
            accessToken   // flat, matches signup's response shape
        });
    } catch (error) {
        next(error);
    }
};


export const getMe = async (req: Request, res: Response , next:NextFunction) => {
    try {
        // req.user was added by userAuthMiddleware
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};