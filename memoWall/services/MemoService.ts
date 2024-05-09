import type { Knex } from "knex";

export class MemoService {
    constructor(private knex: Knex) { }

    // ========== Get All Memos =========
    async getAllMemosInfo() {

        return (await this.knex
            .select('user_id',
                'memo_id',
                this.knex.raw(`CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_id_liked`),
                'memos.id AS all_memo_id',
                'content',
                'image'
            )
            .from('user_memo_like')
            .rightOuterJoin('memos', 'memo_id', 'memos.id')
            .orderBy('memos.updated_at', 'desc')
        );
    }

    async getOneMemoInfo(memoId: number) {

        return (await this.knex
            .select('user_id',
                'memo_id',
                this.knex.raw(`CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_id_liked`),
                'memos.id AS all_memo_id',
                'content',
                'image'
            )
            .from('user_memo_like')
            .rightOuterJoin('memos', 'memo_id', 'memos.id')
            .where('memos.id', memoId)
        )[0];
    }

    // ========== Post New Memo =========
    async postMemo(memoContent: string | string[] | null, memoImage: string | undefined) {

        await this.knex('memos')
            .insert({
                content: memoContent,
                image: memoImage,
                updated_at: this.knex.fn.now()
            });
    }

    // ========== Update Memo Content And Image =========
    async updateMemo(memoContent: string | string[] | null, memoImage: string | undefined, memoId: number | null) {

        await this.knex('memos')
            .update({
                content: memoContent,
                image: memoImage,
                updated_at: this.knex.fn.now()
            })
            .where('id', memoId);
    }

    async pickOrignalMemo(memoId: number) {

        return (await this.knex('memos')
            .where('id', memoId)
        )[0];
    }


    // ========== Edit Memo Like =========
    async createMemoLike(memoId: number, userId: number | undefined) {

        await this.knex('user_memo_like')
            .insert({
                user_id: userId,
                memo_id: memoId
            });
    }

    async cancelMemoLike(memoId: number, userId: number | undefined) {

        await this.knex('user_memo_like')
            .where({
                user_id: userId,
                memo_id: memoId
            })
            .del();
    }

    // ========== Delete Memo =========
    async deleteMemo(memoId: number) {

        await this.knex('memos')
            .where('id', memoId)
            .del();

    }

}