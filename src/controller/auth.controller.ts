import {Request, Response} from "express";
import * as authService from '../services/auth.service';
import  {sendEmail} from "../utils/email.util";


export const authenticateUser = (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        const authTokens = await authService.authenticateUser(username, password);

        if (!authTokens) {
            res.status(401).json({error: "Invalid username or password"});
            return;
        }
         await sendEmail(
            authTokens.user.email,
            "Login Notification",
            `Hello ${authTokens.user.username},\n\nYou have successfully logged in to your account.\n\nBest regards,\nYour Team.`,
            `<p>Hello <strong>${authTokens.user.username}</strong>,</p><p>You have successfully logged in to your account.</p><p>Best regards,<br>Your Team.</p>`
        );
        console.log(`Login notification email sent to successfully ${authTokens.user.email}`);
        res.status(200).json(authTokens);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred"});
    }
};
export const registerUser = async (req: Request, res: Response) => {
    const {username, password, role, email, image, status} = req.body;

    try {
        console.log("Registering user with data:", req.body);
        const result = await authService.registerUser(username, password, role, email, image, status);
        await sendEmail(
            email,
            "Registration Successful",
            `Hello ${username},\n\nYou have successfully registered.\n\nBest regards,\nYour Team.`,
            `<p>Hello <strong>${username}</strong>,</p><p>You have successfully registered.</p><p>Best regards,<br>Your Team.</p>`
        );
        console.log(`Welcome email sent successfully to ${email}`);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({error: error.message});
        } else {
            res.status(400).json({error: "An unknown error occurred"});
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {email, username, role, image, oldPassword, newPassword, status} = req.body;
    const updatedUser = await authService.updateUser(id, email, username, role, image, oldPassword, newPassword, status);
    await sendEmail(
        email,
        "Profile Updated",
        `Hello ${username},\n\nYour profile has been successfully updated.\n\nBest regards,\nYour Team.`,
        `<p>Hello <strong>${username}</strong>,</p><p>Your profile has been successfully updated.</p><p>Best regards,<br>Your Team.</p>`
    );
    res.status(200).json(updatedUser);
 } catch (error)
{
    res.status(400).json({error: error instanceof Error ? error.message : "An unknown error occurred"});
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await authService.getAllUsers();
        console.log("Retrieved users:", users);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred"
        });
    }
});

export const toggleUserStatus = async (req: Request, res: Response) => {
    const {id} = req.params;
    console.log("Toggling status for user with ID:", id);
    try {
        const user = await authService.getUserById(id);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        if (!user.email) {
            return res.status(400).json({error: "User email is not available"});
        }

        const newStatus = user.status === "active" ? "inactive" : "active";

        const updatedUser = await authService.updateUserStatus(id, newStatus);
        await sendEmail(
            user.email,
            "Account Status Updated",
            `Hello ${user.username},\n\nYour account status has been updated to ${newStatus}.\n\nBest regards,\nYour Team.`,
            `<p>Hello <strong>${user.username}</strong>,</p><p>Your account status has been updated to <strong>${newStatus}</strong>.</p><p>Best regards,<br>Your Team.</p>`
        );

        if (!updatedUser) {
            return res.status(500).json({error: "Failed to update user status"});
        }
        res.status(200).json({message: "User status updated successfully", status: updatedUser.status});
    } catch (error) {
        res.status(500).json({error: error instanceof Error ? error.message : "An unknown error occurred"});
    }

};

export const sendOtp = async (req: Request, res: Response) => {
    const {email} = req.body;

    try {
        console.log("Sending OTP to email:", email);
        await authService.sendOtp(email);
        res.status(200).json({message: "OTP sent successfully"});
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred while sending OTP"
        });
    }
};

export const resetPasswordWithOtp = async (req: Request, res: Response) => {
    const {email, otp, newPassword} = req.body;

    try {
        console.log("Resetting password for email:", email);
        const result = await authService.resetPasswordWithOtp(email, otp, newPassword);
        res.status(200).json({message: "Password reset successfully", user: result});
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "An unknown error occurred while resetting password"
        });
    }
}
