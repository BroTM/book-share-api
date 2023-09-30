import {Sequelize} from "sequelize";
import config from "../../config/db.config";
const sequelize = new Sequelize(
    config.database!,
    config.username!,
    config.password,
    {
        host: config.db_host,
        dialect: "mysql",
        timezone: config.timezone,
        pool: {
            max: 20,
            idle: 10000 //Remove a connection from the pool after the connection has been idle (not been used) for 10 seconds
        },
        dialectOptions: {
            useUTC: false, // for reading from database
        }
    }
);

(async () => {
    await sequelize.sync({ alter: true });
})();

export default sequelize;
