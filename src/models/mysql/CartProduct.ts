import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const CartProduct = db.define('CartProducts', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    optionSelected: {
        type: DataTypes.STRING
    },
    orderID: {
        type: DataTypes.STRING
    }
}, {timestamps: false})

export default CartProduct;