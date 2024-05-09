import type { Knex } from "knex";



async function up(knex: Knex) {

    await knex.schema.createTable("memos", (table) => {
        table.increments();
        table.string("content");
        table.string("image");
        table.timestamps(false, true)
    })

    await knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("email");
        table.string("name");
        table.string("password");
        table.timestamps(false, true)
    })

    await knex.schema.createTable("user_memo_like", (table) => {
        table.increments();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("memo_id").unsigned();
        table.foreign("memo_id").references("memos.id");
        table.timestamps(false, true)
    })

}


export async function down(knex: Knex) {
    await knex.schema.dropTable("user_memo_like");
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("memos");
}
