import { Router, Request, Response } from "express";
import { pgClient } from "../pgClient";

export const authRouter = Router();

authRouter.post('/login', login);

authRouter.get('/logout', logout);

authRouter.get('/getUser', getUser);

async function login(req: Request, res: Response) {
    let { email, password } = req.body;
    try {
        let userQueryResult = (
            await pgClient.query("SELECT name,password,id FROM users WHERE email = $1", [email])).rows[0];
        if (userQueryResult) {
            let truePassword = userQueryResult.password;
            if (password == truePassword) {
                req.session.userId = userQueryResult.id;
                req.session.username = userQueryResult.username;
                req.session.save();
                res.status(200).json({
                    message: "Login success",
                    data: { username: userQueryResult.name }
                })
            } else {
                res.status(400).json({ message: "Login fail, wrong password" })
            }
        } else {
            res.status(400).json({ message: "Login fail, wrong email" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal serer error" })
    }
}

async function logout(req: Request, res: Response) {
    if (req.session.username) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).json({ message: 'Unable to log out' })
            } else {
                res.status(200).json({ message: 'Logout successful' })
            }
        })
    } else {
        res.status(400).json({ message: "You are not logged in" })
    }
}


async function getUser(req: Request, res: Response) {
    if (req.session.username) {
        res.status(200).json({ data: { username: req.session.username } });
      } else {
        res.status(400).json({ message: "You are not logged in." });
      }
}