import { DataTypes } from 'sequelize';
import db from '../../db/connection';

const OrderXproducts = db.define('OrderXproducts', {

    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.STRING,
    },
    productId: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
}, {timestamps: false});

export { OrderXproducts };
