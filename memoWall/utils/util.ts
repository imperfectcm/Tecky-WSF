import { Request, Response } from "express";
import formidable from "formidable";
import { unlink } from "fs/promises";


let form = formidable({
  encoding: 'utf-8',
  uploadDir: __dirname + '/../uploads',
  keepExtensions: true,
  allowEmptyFiles: true
})

export const parseForm =(req: Request) =>{
  return new Promise<{ memoContent: string | string[] | null, memoImage: string | undefined, memoId: number | null }>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        
        let memoContent: string | string[] | null
        let memoImage: string | undefined
        let memoId: number | null

        if (fields.content) {
          memoContent = fields.content;
        } else {
          memoContent = null
        }

        if ((files.image as formidable.File).size == 0) {
          await unlink(`${__dirname}/../uploads/${((files.image as formidable.File).newFilename)}`)
          memoImage = undefined
        } else {
          memoImage = ((files.image as formidable.File).newFilename)
        }

        if (fields.id) {
          memoId = ~~fields.id
        } else {
          memoId = null
        }

        resolve({ memoContent, memoImage, memoId })
      }
    })
  })
}

export function createRequest() {
  return {
    session: {},
    cookies: {},
    headers: {},
    query: {},
    body: {},
    fields: {},
    files: {},
    params: {},
  } as unknown as Request;
}


export function createResponse() {
  let res: any = {};
  res.status = jest.fn((status: number) => res)
  res.json = jest.fn(() => null)
  return res as Response;
}

