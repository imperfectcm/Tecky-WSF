import type { Knex } from "knex";

export class MemoService {
    constructor(private knex: Knex) { }

    // ========== Get All Memos =========
    async getAllMemosInfo() {
        // return (await this.client.query(`
        // SELECT user_id, memo_id, 
        // CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_id_liked, 
        // memos.id AS all_memo_id, 
        // content, image 
        // FROM user_memo_like 
        // RIGHT OUTER JOIN memos 
        // ON memo_id = memos.id 
        // ORDER BY updated_at DESC;`)).rows

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
            .orderBy('updated_at', 'desc')
        );
    }

    async getOneMemoInfo(memoId: number) {
        // return (await this.client.query(`
        // SELECT user_id, memo_id, 
        // CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_liked, 
        // memos.id AS all_memo_id, 
        // content, image 
        // FROM user_memo_like 
        // RIGHT OUTER JOIN memos 
        // ON memo_id = memos.id 
        // WHERE memos.id = $1;`, [memoId])).rows[0]

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
        // await this.client.query(`
        // INSERT INTO memos 
        // (content,image,created_at,updated_at) 
        // VALUES ($1,$2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);`,
        //     [memoContent, memoImage]);

        await this.knex('memos')
            .insert({
                content: memoContent,
                image: memoImage,
                updated_at: this.knex.fn.now()
            });
    }

    // ========== Update Memo Content And Image =========
    async updateMemo(memoContent: string | string[] | null, memoImage: string | undefined, memoId: number | null) {
        // await this.client.query(`
        // UPDATE memos 
        // SET content=$1, image=$2, 
        // updated_at = CURRENT_TIMESTAMP 
        // WHERE id = $3;`, [memoContent, memoImage, memoId]);

        await this.knex('memos')
            .update({
                content: memoContent,
                image: memoImage,
                updated_at: this.knex.fn.now()
            })
            .where('id', memoId);
    }

    async pickOrignalMemo(memoId: number) {
        // return (await this.client.query(`
        // SELECT * FROM memos 
        // WHERE id = $1;`, [memoId])).rows[0]

        return (await this.knex('memos')
            .where('id', memoId)
        )[0];
    }


    // ========== Edit Memo Like =========
    async createMemoLike(memoId: number, userId: number | undefined) {
        // await this.client.query(`
        // INSERT INTO user_memo_like (user_id, memo_id) 
        // VALUES ($1, $2);`, [userId, memoId]);

        await this.knex('user_memo_like')
            .insert({
                user_id: userId,
                memo_id: memoId
            });
    }

    async cancelMemoLike(memoId: number, userId: number | undefined) {
        // await this.client.query(`
        // DELETE FROM user_memo_like 
        // WHERE (user_id = $1 AND memo_id = $2);`, [userId, memoId]);

        await this.knex('user_memo_like')
            .where({
                user_id: userId,
                memo_id: memoId
            })
            .del();
    }

    // ========== Delete Memo =========
    async deleteMemo(memoId: number) {
        // await this.client.query(`
        // DELETE FROM memos 
        // WHERE id = $1;`, [memoId]);

        await this.knex('memos')
            .where('id', memoId)
            .del();

    }

}