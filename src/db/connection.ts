 import { Sequelize } from "sequelize";
import { DB_HOST } from "../models/config";
import { DB_NAME } from "../models/config";
import { DB_PASSWORD } from "../models/config";
import { DB_PORT } from "../models/config";
import { DB_USER } from "../models/config";
 const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql"
 })
 export default sequelize;