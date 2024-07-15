import { timestamp } from 'rxjs';
import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Users = db.define('Users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    priceList: {
        type: DataTypes.INTEGER
    },
    client: {
        type: DataTypes.BOOLEAN
    }
}, {timestamps: false});

export default Users;