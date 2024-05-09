import Knex from "knex";
import { config } from "./knexfile"

const configMode = process.env.NODE_ENV || "production"
const knexConfig = config[configMode];
export const knex = Knex(knexConfig)