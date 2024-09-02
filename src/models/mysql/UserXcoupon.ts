import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const UserXcoupon = db.define('UserXcoupons', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userID: {
        type: DataTypes.STRING,
        unique: true,
    },
    couponID: {
        type: DataTypes.STRING
    }
}, {timestamps: false});

export default UserXcoupon;