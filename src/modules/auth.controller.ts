import type { Request,Response } from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { signupSchema } from "../validation/user.validation.js";




// /api/v1/auth/signup
export const signup=async(req:Request , res:Response)=>{
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
    console.error(error)
        return res.status(500).json({
            status:false,
           message:"Something went Wrong"
        })
     }
}