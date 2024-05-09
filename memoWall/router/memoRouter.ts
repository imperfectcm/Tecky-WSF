import { Router } from "express";
import express from "express";
import { isLoggedIn } from "./authRouter";

import { MemoService } from "../services/MemoService";
import { MemoController } from "../controllers/MemoController";

import {knex} from "../knex"


const memoService = new MemoService(knex);
const memoController = new MemoController(memoService);

export const memoRouter = Router();
memoRouter.use(express.json());
memoRouter.use(express.urlencoded({ extended: true }));

memoRouter.get("/", memoController.getAllMemos);
memoRouter.post("/", memoController.postMemo);
memoRouter.put("/", isLoggedIn, memoController.updateMemo);
memoRouter.delete("/", isLoggedIn, memoController.deleteMemo);
memoRouter.put("/findMemo", isLoggedIn, memoController.findMemo);
memoRouter.put("/like", memoController.likeMemo);