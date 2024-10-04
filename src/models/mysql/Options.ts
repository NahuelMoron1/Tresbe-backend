import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Options = db.define('Options', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    productID: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    stock: {
        type: DataTypes.INTEGER,
    }
}, {timestamps: false})

export default Options;