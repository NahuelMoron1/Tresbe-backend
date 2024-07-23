import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Products = db.define('Products', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING
    },
    brand: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    image: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING
    },
    discount: {
        type: DataTypes.FLOAT
    },
    priceDiscount: {
        type: DataTypes.FLOAT
    },
    optionSelected: {
        type: DataTypes.STRING
    },
    latestID: {
        type: DataTypes.STRING
    }
}, {timestamps: false})

export default Products;