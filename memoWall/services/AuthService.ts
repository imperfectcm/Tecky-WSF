import type { Knex } from "knex";


export class AuthService {
    constructor(private knex: Knex) { }

    // async getUserInfoByEmail(email: string) {
    //     return (await this.client.query(`
    //     SELECT id,name,password 
    //     FROM users WHERE email = $1`, [email])).rows[0];
    // }

    async getUserInfoByEmail(email: string) {
        return (await this.knex
            .select('id', 'name', 'password')
            .from('users')
            .where('email', email)
        )[0]
    }
    
}