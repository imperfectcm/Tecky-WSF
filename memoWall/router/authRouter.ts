import { Router, Request, Response, NextFunction } from "express";

// import { authController } from "../main";

import { AuthService } from "../services/AuthService";
import { AuthController } from "../controllers/AuthController";
import { knex } from "../knex";

const authService = new AuthService(knex)
const authController = new AuthController(authService)

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);
authRouter.get('/checkUser', authController.checkUser);


export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.username) {
        next();
    } else {
        res.status(400).json({ message: "You are not logged in" })
        return;
    }
}