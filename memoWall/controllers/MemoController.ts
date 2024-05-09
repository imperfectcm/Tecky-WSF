// import formidable, { Fields, Files } from "formidable";
import { MemoService } from "../services/MemoService";
import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { parseForm } from "../utils/util";

// let form = formidable({
//     encoding: 'utf-8',
//     uploadDir: __dirname + '/../uploads',
//     keepExtensions: true,
//     allowEmptyFiles: true
// })

export class MemoController {
    constructor(private memoService: MemoService) { }

    getAllMemos = async (req: Request, res: Response) => {
        try {
            const memoList = await this.memoService.getAllMemosInfo();

            res.status(200).json({
                userId: req.session.userId,
                data: memoList
            });
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }



    postMemo = async (req: Request, res: Response) => {
        // let memoContent: string | string[] | null;
        // let memoImage: string | undefined;

        let { memoContent, memoImage, memoId } = await parseForm(req)
        memoId = memoId

        try {
            await this.memoService.postMemo(memoContent, memoImage)

            res.status(200).json({
                message: "Upload success",
            })
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }



    updateMemo = async (req: Request, res: Response) => {

        try {
            let { memoContent, memoImage, memoId } = await parseForm(req)

            if (memoId) {

                try {
                    const originalImage = (await this.memoService.pickOrignalMemo(memoId)).image;
                    console.log(originalImage);

                    if (memoImage == undefined) {
                        memoImage = originalImage
                        
                    } else {
                        await unlink(`${__dirname}/../uploads/${originalImage}`)
                    }

                    await this.memoService.updateMemo(memoContent, memoImage, memoId)

                } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Internal server error" })
                }
            }

            res.status(200).json({
                message: "Upload success",
            })
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }

    }



    findMemo = async (req: Request, res: Response) => {
        let { memoId } = req.body
        try {
            let memoInfo = await this.memoService.getOneMemoInfo(memoId);
            res.status(200).json({
                userId: req.session.userId,
                memoInfo: memoInfo
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }
    }



    likeMemo = async (req: Request, res: Response) => {
        let { memoId, isliked } = req.body
        let userId = req.session.userId

        try {
            if (isliked == 0) {
                await this.memoService.createMemoLike(memoId, userId)
                let memoInfo = await this.memoService.getOneMemoInfo(memoId)

                res.status(200).json({
                    message: "Like success",
                    userId: userId,
                    memoInfo: memoInfo
                })


            } else if (isliked == 1) {
                await this.memoService.cancelMemoLike(memoId, userId)
                let memoInfo = await this.memoService.getOneMemoInfo(memoId)

                res.status(200).json({
                    message: "Unlike success",
                    userId: userId,
                    memoInfo: memoInfo
                })

            }
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }
    }



    deleteMemo = async (req: Request, res: Response) => {
        let memoId = req.body.id

        let orignalMemo = (await this.memoService.pickOrignalMemo(memoId));
        let orignalImage = orignalMemo.image

        try {

            await this.memoService.deleteMemo(memoId);

            if (orignalImage) {
                await unlink(`${__dirname}/../uploads/${orignalImage}`)
            }

            res.status(200).json({ message: "Delete success" })
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" })
        }
    }

}