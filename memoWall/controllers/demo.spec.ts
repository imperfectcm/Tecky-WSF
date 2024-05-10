import { Knex } from "knex";
import { Request, Response } from "express";
import { MemoController } from "./MemoController";
import { MemoService } from "../services/MemoService";
import { jest } from "@jest/globals"

import {
    createRequest,
    createResponse,
} from "../utils/util";
import fs from "fs/promises";


describe("MemoController", () => {
    let memoController: MemoController;
    let memoService: MemoService;
    let req: Request;
    let res: Response;
    let resolveObj = {
        memoContent: "test post content",
        memoImage: "test_post_content.jpg",
        memoId: 1
    }


    beforeEach(async () => {

        memoService = new MemoService({} as Knex);

        memoService.getAllMemosInfo = jest.fn(async () => [{ memoContent: "getAllMemosInfo", memoImage: "abc.jpg" }])
        memoService.getOneMemoInfo = jest.fn(async () => [{ memoContent: "getOneMemoInfo", memoImage: "xyz.jpg" }])
        memoService.pickOrignalMemo = jest.fn(async () => { return { image: "original_image.jpg" } })
        memoService.postMemo = jest.fn(async (memoContent: string, memoImage: string) => { })
        memoService.updateMemo = jest.fn(async (memoContent: string, memoImage: string, memoId: number) => { })
        memoService.createMemoLike = jest.fn(async (memoId: number, userId: number) => { })
        memoService.cancelMemoLike = jest.fn(async (memoId: number, userId: number) => { })
        memoService.deleteMemo = jest.fn(async (memoId: number) => { })

        fs.unlink = jest.fn(async () => { })

        req = createRequest()
        req.session.userId = 1
        res = createResponse()

        let test_util: any = await import('../utils/util');
        test_util.parseForm = jest.fn(async () => {
            return {
                memoContent: "test post content",
                memoImage: "test_post_content.jpg",
                memoId: 10
            }
        })
        // jest.spyOn(upload, "parseForm").mockResolvedValue(resolveObj)


        memoController = new MemoController(memoService);
    });


    // ========== Update Memo Test ==========
    it("should edit memo success", async () => {

        // step 2: call the method
        await memoController.updateMemo(req, res);

        // Step 3: expectation
        expect(memoService.pickOrignalMemo).toHaveBeenCalledTimes(1);
        expect(memoService.updateMemo).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Edit success" });
    });

})
