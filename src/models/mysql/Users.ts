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
        type: DataTypes.STRING
    },
    client: {
        type: DataTypes.BOOLEAN
    },
    seller: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ['password', 'priceList', 'seller'] }, // Excluir 'password' por defecto
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] }, // Incluir 'password' solo cuando se use este scope
        },
        withPriceList: {
            attributes: { include: ['priceList'] }, // Incluir 'password' solo cuando se use este scope
        },
        withAll: {
            attributes: { include: ['password', 'priceList', 'seller'] }, // Incluir 'password' solo cuando se use este scope
        },
    },
});

export default Users;