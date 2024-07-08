"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Order = connection_1.default.define('Orders', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
    },
    discount: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    delivery: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    subtotal: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    total: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    orderDate: {
        type: sequelize_1.DataTypes.DATE,
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
    },
    userdataId: {
        type: sequelize_1.DataTypes.STRING,
    }
});
exports.default = Order;
