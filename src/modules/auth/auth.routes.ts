import express from "express";
import { getMe, signin, signup } from "./auth.controller.js";

import { userAuthMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// router.post("/signup",)
router.post("/signup",signup);
router.post("/signin",signin);
router.get("/getMe",userAuthMiddleware,getMe);


export default router;