 import { Sequelize } from "sequelize";

 const sequelize = new Sequelize('tresbe', 'root', 'QUITADO_POR_SEGURIDAD', {
    host: 'localhost',
    port: 3306,
    dialect: "mysql"
 })
 export default sequelize;