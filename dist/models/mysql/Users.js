"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../db/connection"));
const sequelize_1 = require("sequelize");
const Users = connection_1.default.define('Users', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    username: {
        type: sequelize_1.DataTypes.STRING
    },
    priceList: {
        type: sequelize_1.DataTypes.STRING
    },
    client: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    seller: {
        type: sequelize_1.DataTypes.STRING
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
exports.default = Users;
