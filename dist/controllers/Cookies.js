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
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        if (token) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    else {
        if (cookieName == 'admin_token') {
            if (!token) {
                res.json(false);
            }
            else {
                res.json(true);
            }
        }
        try {
            const data = jsonwebtoken_1.default.verify(refreshToken, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User                
                const access_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, config_1.SECRET_JWT_KEY, {
                    expiresIn: "1h"
                });
                res.cookie('access_token', access_token, {
                    path: '/',
                    httpOnly: true,
                    secure: true, ///process.env.NODE_ENV == 'production',
                    sameSite: 'none',
                    domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                    maxAge: 1000 * 60 * 60
                });
                const adminToken = req.cookies.admin_token;
                if (adminToken || user.email == config_1.admin) {
                    const admin_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, config_1.SECRET_JWT_KEY, {
                        expiresIn: "1h"
                    });
                    res.cookie('admin_token', admin_token, {
                        path: '/',
                        httpOnly: true,
                        secure: true, ///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                        sameSite: 'none',
                        maxAge: 1000 * 60 * 60
                    });
                }
            }
            else {
                return res.status(401).send("Acceso denegado");
            }
        }
        catch (error) {
            return res.status(401).send("acceso denegado");
        }
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
