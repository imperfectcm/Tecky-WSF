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

// async function login(req: Request, res: Response) {
//     let { email, password } = req.body;

//     try {
//         let userInfo = await authService.getUserInfoByEmail(email);

//         if (userInfo) {
//             let truePassword = userInfo.password;

//             if (password == truePassword) {
//                 req.session.userId = userInfo.id;
//                 req.session.username = userInfo.name;
//                 req.session.save();
//                 console.log("Logged in userId : ", req.session.userId)
//                 console.log("Logged in username : ", req.session.username)
//                 res.status(200).json({
//                     userId: req.session.userId,
//                     data: userInfo
//                 })
//                 return
//             }
//             res.status(400).json({ message: "Login failed" })
//             return

//         }
//         res.status(400).json({ message: "Login failed" })
//         return

//     } catch (error: any) {
//         console.log(error)
//         res.json({ message: error.message })
//     }
// }

// async function logout(req: Request, res: Response) {
//     try {
//         if (req.session.userId) {
//             req.session.destroy(err => {
//                 if (err) {
//                     res.status(400).json({ message: 'Unable to log out' })
//                     return
//                 } else {
//                     res.status(200)
//                         .json({
//                             message: 'Logout successful'
//                         })
//                 }
//             })
//         } else {
//             res.status(400).json({ message: "You are not logged in" })
//             return
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Internal serer error" })
//     }
// }


// async function checkUser(req: Request, res: Response) {
//     try {
//         if (req.session.username) {
//             res.status(200).json({
//                 userId: req.session.userId,
//                 data: { username: req.session.username }
//             });
//             return
//         }

//         res.status(400).json({ message: "You are not logged in." });
//         return
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Internal serer error" })
//     }
// }


export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.username) {
        next();
    } else {
        res.status(400).json({ message: "You are not logged in" })
        return;
    }
}