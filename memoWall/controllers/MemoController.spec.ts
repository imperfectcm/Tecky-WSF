import { Knex } from "knex";
import { Request, Response } from "express";
import { MemoController } from "./MemoController";
import { MemoService } from "../services/MemoService";
import * as upload from "../utils/util";

import {
    createRequest,
    createResponse,
} from "../utils/util";
import fs from "fs/promises";


describe.skip("MemoController", () => {
    let memoController: MemoController;
    let memoService: MemoService;
    let req: Request;
    let res: Response;
    let resolveObj = {
        memoContent: "test post content",
        memoImage: "test_post_content.jpg",
        memoId: 1
    }

    beforeEach(() => {
        memoService = new MemoService({} as Knex);

        memoService.getAllMemosInfo = jest.fn(async () => [{ memoContent: "getAllMemosInfo", memoImage: "abc.jpg" }])
        memoService.getOneMemoInfo = jest.fn(async () => [{ memoContent: "getOneMemoInfo", memoImage: "xyz.jpg" }])
        memoService.pickOrignalMemo = jest.fn().mockResolvedValue({ image: "original_image.jpg" })
        memoService.postMemo = jest.fn(async (memoContent: string, memoImage: string) => { })
        memoService.updateMemo = jest.fn(async (memoContent: string, memoImage: string, memoId: number) => { })
        memoService.createMemoLike = jest.fn(async (memoId: number, userId: number) => { })
        memoService.cancelMemoLike = jest.fn(async (memoId: number, userId: number) => { })
        memoService.deleteMemo = jest.fn(async (memoId: number) => { })

        fs.unlink = jest.fn()

        req = createRequest()
        req.session.userId = 1
        res = createResponse()

        jest.spyOn(upload, "parseForm").mockResolvedValue(resolveObj)

        memoController = new MemoController(memoService);
    });


    // ========== Get Memos Test ==========
    it("should get all memos", async () => {
        // step 2: call the method
        await memoController.getAllMemos(req, res);

        // Step 3: expectation
        expect(memoService.getAllMemosInfo).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            userId: 1,
            data: [{ memoContent: "getAllMemosInfo", memoImage: "abc.jpg" }]
        });
    });


    it("should fail to get all memos", async () => {
        memoService.getAllMemosInfo = jest.fn(() => {
            throw new Error("Failed to get memo")
        });

        let memoSpy = jest.spyOn(memoService, "getAllMemosInfo")

        await memoController.getAllMemos(req, res);

        expect(memoSpy).toHaveBeenCalledTimes(1);
        expect(memoService.getAllMemosInfo).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to get memo" });
    });


    // ========== Post Memo Test ==========
    it("should post memo success", async () => {
        const resolveObj = {
            memoContent: "test post content",
            memoImage: "test_post_content.jpg",
            memoId: 1
        }
        jest.spyOn(upload, "parseForm").mockResolvedValue(resolveObj)
        // step 2: call the method
        await memoController.postMemo(req, res);

        // Step 3: expectation
        expect(memoService.postMemo).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Upload success" });
    });


    it("should fail to post memo success", async () => {

        memoService.postMemo = jest.fn(() => {
            throw new Error("Failed to get memo")
        });
        // step 2: call the method
        await memoController.postMemo(req, res);

        // Step 3: expectation
        // expect(memoService.postMemo).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
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
