import { Sequelize } from "sequelize-typescript";
import config from "../../config/db.config";
import path from 'path'

class Database {
    public sequelize: Sequelize | undefined;

    constructor() {
        this.connectToDatabase();
    }

    private async connectToDatabase() {
        this.sequelize = new Sequelize({
            database: config.database!,
            username: config.username!,
            password: config.password,
            dialect: "mysql",
            host: config.db_host,
            timezone: config.timezone,
            pool: {
                max: 20,
                idle: 10000 //Remove a connection from the pool after the connection has been idle (not been used) for 10 seconds
            },
            models: [path.join(__dirname, '/../models/*.model.ts')]
        }
        );
        await this.sequelize
            .authenticate()
            .then(() => {
                console.log("Connection has been established successfully.");
            })
            .catch((err) => {
                console.error("Unable to connect to the Database:", err);
            });
    }
}

export default Database;
