"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.tokenExist = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const tokenExist = (req, res) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if (!token) {
        res.json(false);
    }
    else {
        res.json(true);
    }
};
exports.tokenExist = tokenExist;
const getToken = (req, res) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if (!token) {
        return false;
    }
    else {
        try {
            const data = jsonwebtoken_1.default.verify(token, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User
                return res.json(user);
            }
            else {
                return res.status(401).send("Acceso denegado");
            }
        }
        catch (error) {
            return res.status(401).send("acceso denegado");
        }
    }
};
exports.getToken = getToken;
