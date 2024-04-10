import express from "express";
// import { Request, Response } from "express";
import expressSession from "express-session";
import path from 'path';
import fs from 'fs';
// import jsonfile from "jsonfile";
// import formidable from 'formidable';
// import { pgClient } from "./pgClient";
import { authRouter } from "./router/authRouter";
import { memoRouter } from "./router/memoRouter";

const PORT = 8080;

declare module "express-session" {
    interface SessionData {
        userId?: number;
        username?: string;
    }
}

const uploadDir = './public/memoPic'
fs.mkdirSync(uploadDir, { recursive: true })

export const app = express();
if (process.env.SECRET) {
    app.use(
        expressSession({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: true,
        })
    );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/memo", memoRouter);

app.use(express.static('public'));
app.use(express.static('uploads'));

app.use((req, res) => {
    res.sendFile(path.resolve('./public/404/404.html'))
})

app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost:${PORT}`)
})