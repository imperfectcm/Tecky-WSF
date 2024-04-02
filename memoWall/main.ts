import express from "express";
import { Request, Response } from "express";
import path from 'path';
import expressSession from "express-session";

const app = express();

app.use(
    expressSession({
        secret: "CM Memo",
        resave: true,
        saveUninitialized: true,
    })
);

declare module "express-session" {
    interface SessionData {
        name?: string;
    }
}

app.use((req, res, next) => {
    console.log("hi",req.session,req.path)
    next()
})

app.get('/hello', function (req: Request, res: Response) {
    res.end("Hello World2")
})

app.use(express.static('public'))

app.use((req, res) => {
    res.sendFile(path.resolve('404', '404.html'))
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost: ${PORT}`)
})