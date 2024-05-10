import { knex } from "../knex";
import { MemoService } from "./MemoService";

describe.skip("MemoService", () => {
    let memoService: MemoService;

    let memoIds: number[];

    beforeEach(async () => {
        memoService = new MemoService(knex);

        memoIds = (
            await knex
                .insert([
                    {
                        content: "Memo 1",
                        image: "abc.jpg",
                    },
                    {
                        content: "Memo 2",
                        image: "def.jpg",
                    },
                ])
                .into("memos")
                .returning("id")
        ).map((m) => m.id);

    });


    it("should get memos", async () => {
        const memos = await memoService.getAllMemosInfo();

        const filteredMemos = memos
            .filter((m) => memoIds.includes(m.id as number))
            .sort((left, right) => (left.text > right.text ? 1 : -1));

        expect(filteredMemos).toMatchObject([
            {
                content: "Memo 1",
                image: "abc.jpg",
            },
            {
                content: "Memo 2",
                image: "def.jpg",
            },
        ]);
    });



    afterEach(async () => {
        // Removed inserted data to keep testing database clean
        await knex("memos").whereIn("id", memoIds).del();
        await knex("memos").where("content", "New Memo").del();
      });
    
      afterAll(async () => {
        await knex.destroy();
      });

})
