import { DataTypes } from 'sequelize';
import db from '../../db/connection';

const Coupon = db.define('Coupons', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
    },
    percentage: {
        type: DataTypes.FLOAT,
    },
    expires: {
        type: DataTypes.DATE,
    },
    used: {
        type: DataTypes.BOOLEAN,
    },
    minimum: {
        type: DataTypes.FLOAT,
    }
}, {timestamps: false});

export default Coupon;