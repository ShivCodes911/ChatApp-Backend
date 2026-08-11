import {z} from "zod";

export const signupSchema=z.object({
    name:z.string(),
    email:z.string().email().toLowerCase().trim(),
    password:z.string().min(3).max(15)
});

export const signinSchema=z.object({
    email:z.string().email().toLowerCase().trim(),
    password:z.string().min(3).max(15)
});
