import { DataTypes } from 'sequelize';
import db from '../../db/connection';

const Order = db.define('Orders', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
    },
    discount: {
        type: DataTypes.FLOAT,
    },
    delivery: {
        type: DataTypes.FLOAT,
    },
    subtotal: {
        type: DataTypes.FLOAT,
    },
    total: {
        type: DataTypes.FLOAT,
    },
    userID: {
        type: DataTypes.STRING,
    }
});

export default Order;