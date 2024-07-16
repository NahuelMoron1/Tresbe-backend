import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Brands = db.define('Brands', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    }
}, {timestamps: false})

export default Brands;