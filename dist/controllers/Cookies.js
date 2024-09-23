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
        return false;
    }
    else {
        return true;
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
            res.json(data);
        }
        catch (error) {
            return res.status(401).send("acceso denegado");
        }
        return true;
    }
};
exports.getToken = getToken;
