import express from "express";
import helmet from "helmet";

import authRouter from "./modules/auth.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app=express();

app.use(helmet());
app.use(express.json());




app.use("/api/v1/auth",authRouter);




app.use(errorMiddleware);
export default app;
