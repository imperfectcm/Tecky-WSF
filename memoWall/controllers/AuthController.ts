import { AuthService } from "../services/AuthService";
import { Request, Response } from "express";


export class AuthController {
    constructor(private authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        let { email, password } = req.body;
    
        try {
            let userInfo = await this.authService.getUserInfoByEmail(email);
    
            if (userInfo) {
                let truePassword = userInfo.password;
    
                if (password == truePassword) {
                    req.session.userId = userInfo.id;
                    req.session.username = userInfo.name;
                    req.session.save();
                    console.log("Logged in userId : ", req.session.userId)
                    console.log("Logged in username : ", req.session.username)
                    res.status(200).json({
                        userId: req.session.userId,
                        data: userInfo
                    })
                    return
                }
                res.status(400).json({ message: "Login failed" })
                return
    
            }
            res.status(400).json({ message: "Login failed" })
            return
    
        } catch (error: any) {
            console.log(error)
            res.json({ message: error.message })
        }
    }



    logout = async (req: Request, res: Response) => {
        try {
            if (req.session.userId) {
                req.session.destroy(err => {
                    if (err) {
                        res.status(400).json({ message: 'Unable to log out' })
                        return
                    } else {
                        res.status(200)
                            .json({
                                message: 'Logout successful'
                            })
                    }
                })
            } else {
                res.status(400).json({ message: "You are not logged in" })
                return
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal serer error" })
        }
    }



    checkUser = async (req: Request, res: Response) => {
        try {
            if (req.session.username) {
                res.status(200).json({
                    userId: req.session.userId,
                    data: { username: req.session.username }
                });
                return
            }
    
            res.status(400).json({ message: "You are not logged in." });
            return
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal serer error" })
        }
    }

}