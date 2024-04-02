import express from "express";
import { Request, Response } from "express";
import path from 'path';
import expressSession from "express-session";

const app = express();
let count = 0;
let date_time = new Date();
// get current date
// adjust 0 before single digit date
let date = ("0" + date_time.getDate()).slice(-2);

// get current month
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

// get current year
let year = date_time.getFullYear();

// get current hours
let hours = date_time.getHours();

// get current minutes
let minutes = date_time.getMinutes();

// get current seconds
let seconds = date_time.getSeconds();

// prints date & time in YYYY-MM-DD HH:MM:SS format
let currentTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

app.use(
    expressSession({
        secret: "CM Memo",
        resave: true,
        saveUninitialized: true,
    })
);

declare module "express-session" {
    interface SessionData {
        name?: String;
        counter?: Number;
    }
}

app.use((req, res, next) => {
    // console.log("hi", req.session, req.path)
    count++;
    req.session.counter = count;
    // console.log("hi", req.session);
    next()
    return count;
})

app.get('/hello', function (req: Request, res: Response) {
    res.end("Hello World2")
})

app.use((req, res, next) => {
    console.log([currentTime],` Request `,req.path)
    next()
})



app.use(express.static('public'))

app.use((req, res) => {
    res.sendFile(path.resolve('404', '404.html'))
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost: ${PORT}`)
})