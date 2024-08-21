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
    orderDate: {
        type: DataTypes.DATE,
    },
    userID: {
        type: DataTypes.STRING,
    },
    userdataId: {
        type: DataTypes.STRING,
    },
    payed: {
        type: DataTypes.BOOLEAN,
    },
    attended: {
        type: DataTypes.BOOLEAN,
    },
    username: {
        type: DataTypes.STRING,
    }
}, {timestamps: false});

export default Order;