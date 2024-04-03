import express from "express";
import { Request, Response } from "express";
import path from 'path';
import expressSession from "express-session";
import jsonfile from "jsonfile";

declare module "express-session" {
    interface SessionData {
        name?: string;
        count?: number;
        firstTime?: boolean;
    }
}
const app = express();
app.use(
    expressSession({
        secret: "CM Memo",
        resave: true,
        saveUninitialized: true,
    })
);




app.use((req, res, next) => {
    if (req.session.count != undefined) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    req.session.save()
    console.log("session counter: ", req.session.count, " times")
    next()
})




app.use(express.json());
app.use(express.urlencoded());

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
export let currentTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);




app.get('/hello', function (req: Request, res: Response) {
    res.end("Hello World2")
})





app.get('/students', async (req, res) => {
    // console.log(req.query.name)
    const students = await jsonfile.readFile(path.resolve('./students.json'))
    res.status(200).json(students)
})

app.post('/students', async (req, res) => {
    const students = await jsonfile.readFile(path.resolve('./students.json'))
    const { name, age } = req.body
    students.push({
        name,
        age
    })
    await jsonfile.writeFile(path.resolve('./students.json'), students, { spaces: 4 })
    res.redirect('/')
    // console.log(req.body)
    // res.end('')
})

app.put('/students/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    res.end('')
})

app.delete('/students', (req, res) => {
    res.end('')
})





app.post('/', async (req, res) => {
    const memos = await jsonfile.readFile(path.resolve('./memos.json'))
    const { content, image } = req.body
    memos.push({
        content,
        image
    })
    await jsonfile.writeFile(path.resolve('./memos.json'), memos, { spaces: 4 })
    console.log(memos)
    res.redirect('/')
})

// app.use('/', express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     console.log([currentTime], ` `, ` Request `, req.method, req.path)
//     next()
// }, express.static('public')
// )

app.use( express.static('public')
)

app.use((req, res) => {
    res.sendFile(path.resolve('./public/404/404.html'))
})



const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost:${PORT}`)
})