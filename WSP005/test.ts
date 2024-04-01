import express from "express";
import { Request, Response } from "express";
import path from 'path';
import expressSession from 'express-session';

const app = express()

app.use(
    expressSession({
        secret: "Tecky Academy teaches typescript",
        resave: true,
        saveUninitialized: true,
    })
);

declare module "express-session" {
    interface SessionData {
        name?: string;
    }
}

app.get('/name', (req, res)=>{
    req.session.name = "CM"
    res.end(req.session.name)
    console.log(req.session)
})

app.use('/hello', function (req, res, next) {
    if (Math.random() > 0.5) {
        next()
        return;
    }
    res.end("Ramdom number smaller than 0.5")
})

app.get('/hello', function (req: Request, res: Response) {
    res.end("Hello World2")
})

app.get('/text', function (req, res) {
    res.sendFile(path.resolve('text', 'text.txt'))
})

app.use(express.static('public'))

app.use((req, res)=>{
    res.sendFile(path.resolve('public','404.html'))
})

const PORT = 9999

app.listen(PORT, () => {
    console.log(`Listening at http://localhost: ${PORT}`)
})