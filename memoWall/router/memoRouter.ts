import { Router, Request, Response } from "express";
import { pgClient } from "../pgClient";
import formidable from "formidable";

export const memoRouter = Router();

memoRouter.get("/", getAllMemos);

memoRouter.post("/", postMemo);

memoRouter.put("/", updateMemo);

memoRouter.delete("/", deleteMemo);

let form = formidable({
    encoding: 'utf-8',
    uploadDir: __dirname + '/../uploads',
    keepExtensions: true,
    allowEmptyFiles: true
})

async function getAllMemos(req: Request, res: Response) {
    try {
        let memoQueryResult = (await pgClient.query("SELECT id,content,image FROM memos ORDER BY updated_at ASC")).rows;
        console.log(memoQueryResult)
        res.status(200).json({ data: memoQueryResult });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal serer error" })
    }
}

async function postMemo(req: Request, res: Response) {
    let memoContent: string | string[];
    let memoImage: string;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "You need to fill the content" })
        }

        if (fields.content) {
            memoContent = fields.content;
        }

        if (files) {
            memoImage = ((files.image as formidable.File).newFilename)
        }
        let memoQueryResult = await pgClient.query("INSERT INTO memos (content,image,created_at,updated_at) VALUES ($1,$2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)RETURNING id,content,image",[memoContent,memoImage]);
        res.status(200).json({
            message:"upload success",
            data:{
                id:memoQueryResult.rows[0].id,
                content:memoQueryResult.rows[0].content,
                image:memoQueryResult.rows[0].image
            }
        })
    });
}

async function updateMemo(req: Request, res: Response) {

}

async function deleteMemo(req: Request, res: Response) {

}