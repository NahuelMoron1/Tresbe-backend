"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdmin = exports.admin = exports.MAINTENANCE = exports.DB_PORT = exports.URL = exports.SLACK_WEBHOOK_URL = exports.SLACK = exports.DOMAIN = exports.SECRET_JWT_KEY = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_USER = process.env.DB_USER;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_NAME = process.env.DB_NAME;
exports.SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
exports.DOMAIN = process.env.DOMAIN;
exports.SLACK = process.env.SLACK;
exports.SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
exports.URL = process.env.URL;
exports.DB_PORT = parseInt(process.env.DB_PORT || "0");
exports.MAINTENANCE = process.env.MAINTENANCE === "true";
exports.admin = [
    "nahuelarielmoron1@gmail.com",
    "growdistribuidora@gmail.com",
    "gabriel_mardones@hotmail.com",
    "distribuidoragrowventas@gmail.com",
    "gabottojuan@gmail.com",
];
exports.superAdmin = [
    "nahuelarielmoron1@gmail.com",
    "growdistribuidora@gmail.com",
];
