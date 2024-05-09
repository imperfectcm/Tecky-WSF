import type { Knex } from "knex";


export class AuthService {
    constructor(private knex: Knex) { }

    async getUserInfoByEmail(email: string) {
        return (await this.knex
            .select('id', 'name', 'password')
            .from('users')
            .where('email', email)
        )[0]
    }
    
}