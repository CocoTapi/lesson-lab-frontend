import pg from "pg";
import env from "dotenv"

env.config();

export default class Database {

    static #db: pg.Client | null = null;

    public static get db(): pg.Client {
        console.log(process.env.PG_USER);
        if (!Database.#db) {
            Database.#db = new pg.Client({
                user: process.env.PG_USER,
                host: process.env.PG_HOST,
                database: process.env.PG_DATABASE,
                password: process.env.PG_PASSWORD,
                port: parseInt(process.env.PG_PORT as string),
            });
            Database.#db.connect();
        }

        return Database.#db;
    }

    public static set db(db: pg.Client | null) {
        Database.#db = db;
    }

}