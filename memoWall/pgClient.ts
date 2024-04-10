import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();
 
export const pgClient = new Client({
//   host: 'my.database-server.com',
//   port: 5334,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

pgClient.connect()