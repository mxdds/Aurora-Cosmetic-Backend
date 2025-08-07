import { Router } from 'express';
import {authenticateUser, registerUser, updateUser, getAllUsers,toggleUserStatus, sendOtp, resetPasswordWithOtp} from '../controller/auth.controller';

const authRouter:Router = Router();
authRouter.post('/login', authenticateUser);
authRouter.post("/register",registerUser);
authRouter.put("/update/:id",updateUser);
authRouter.get("/all",getAllUsers);
authRouter.post("/:id/toggle-active", (req,res,next) =>{
    console.log("Route hit for toggling user status");
    next();
}, toggleUserStatus);
authRouter.post("/send-otp",sendOtp);
authRouter.post("/reset-password-with-otp", resetPasswordWithOtp);

export default authRouter;