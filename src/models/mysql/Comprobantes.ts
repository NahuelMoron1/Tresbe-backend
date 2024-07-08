import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Comprobantes = db.define('Comprobantes', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    orderID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    }
})

export default Comprobantes;