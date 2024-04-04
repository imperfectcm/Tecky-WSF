import express from "express";
import { Request, Response } from "express";
import path from 'path';
import expressSession from "express-session";
import jsonfile from "jsonfile";
import formidable from 'formidable';
import fs from 'fs';

declare module "express-session" {
    interface SessionData {
        name?: string;
        count?: number;
        firstTime?: boolean;
    }
}

const uploadDir = 'memoPic'
fs.mkdirSync(uploadDir, { recursive: true })

const app = express();
app.use(
    expressSession({
        secret: "CM Memo",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     if (req.session.count != undefined) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     req.session.save()
//     console.log("session counter: ", req.session.count, " times")
//     next()
// })

let date_time = new Date();
let date = ("0" + date_time.getDate()).slice(-2);
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
let year = date_time.getFullYear();
let hours = date_time.getHours();
let minutes = date_time.getMinutes();
let seconds = date_time.getSeconds();
let currentTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
let counter = 0

const form = formidable({
    // other fields omitted
    filename: (originalName, originalExt, part, form) => {
        let fieldName = part.name
        let timestamp = (year + month + date + hours + minutes + seconds)
        let ext = part.mimetype?.split('/').pop()
        counter++
        return `${fieldName}-${timestamp}-${counter}.${ext}`
    },
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 200 * 1024, // the default limit is 200KB
    filter: part => part.mimetype?.startsWith('image/') || false,
})

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




app.post('/upload-textVersion', async (req, res) => {
    await console.log("New memo uploaded: ", req.body)
    const memos = await jsonfile.readFile(path.resolve('./memos.json'))
    memos.push(req.body)
    await jsonfile.writeFile(path.resolve('./memos.json'), memos, { spaces: 4, encoding:'utf8'})
    res.redirect('/')
})

app.post('/upload', (req, res) => {
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err)
            res.redirect('/');
        } else {
            const memos = await jsonfile.readFile(path.resolve('./memos.json'))
            memos.push({
                ...fields,
                memoPic: (files.memoPic as formidable.File).newFilename
            })
            await jsonfile.writeFile(path.resolve('./memos.json'), memos, { spaces: 4, encoding: 'utf8' })
            res.redirect('/')
        }
    })
})

app.use((req, res, next) => {
    console.log([currentTime], ` `, ` Request `, req.method, req.path)
    next()
}, express.static('public')
)

app.use((req, res) => {
    res.sendFile(path.resolve('./public/404/404.html'))
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Listening at http://localhost:${PORT}`)
})