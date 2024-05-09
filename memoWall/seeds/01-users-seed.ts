import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_memo_like").del();
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            email: 'cm@tecky.io',
            name: "cm",
            password: '1234',
        },
        {
            email: 'james@tecky.io',
            name: "james",
            password: '1234',
        },
        {
            email: 'adams@tecky.io',
            name: "adams",
            password: '1234',
        },
    ]);
};
