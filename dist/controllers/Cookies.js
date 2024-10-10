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
            return res.json(true); // Usamos return para evitar que siga ejecutando código
        }
        else {
            return res.json(false); // Usamos return para evitar que siga ejecutando código
        }
    }
    else {
        if (cookieName == 'admin_token') {
            if (!token) {
                return res.json(false); // Usamos return para evitar que siga ejecutando código
            }
            else {
                return res.json(true); // Usamos return para evitar que siga ejecutando código
            }
        }
        try {
            const data = jsonwebtoken_1.default.verify(refreshToken, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User                
                const access_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, config_1.SECRET_JWT_KEY, { expiresIn: "1h" });
                res.cookie('access_token', access_token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60
                });
                const adminToken = req.cookies.admin_token;
                if (adminToken) {
                    const dataAdmin = jsonwebtoken_1.default.verify(adminToken, config_1.SECRET_JWT_KEY);
                    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
                        const userAux = dataAdmin;
                        if (userAux.email == config_1.admin && user.email == config_1.admin) {
                            const admin_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, config_1.SECRET_JWT_KEY, { expiresIn: "1h" });
                            res.cookie('admin_token', admin_token, {
                                path: '/',
                                httpOnly: true,
                                secure: true,
                                domain: '.tresbedistribuidora.com',
                                sameSite: 'none',
                                maxAge: 1000 * 60 * 60
                            });
                        }
                    }
                }
                return res.json(true); // Usamos return para evitar que siga ejecutando código
            }
            else {
                return res.status(401).send("Acceso denegado"); // Enviamos respuesta y detenemos la ejecución
            }
        }
        catch (error) {
            return res.status(401).send("acceso denegado"); // Enviamos respuesta en caso de error y detenemos la ejecución
        }
    }
};
exports.tokenExist = tokenExist;
const getToken = (req, res) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if (!token) {
        return res.json(false); // Usamos return para detener la ejecución
    }
    else {
        try {
            const data = jsonwebtoken_1.default.verify(token, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User
                return res.json(user); // Enviamos la respuesta y terminamos la ejecución
            }
            else {
                return res.status(401).send("Acceso denegado"); // Enviamos respuesta de error y detenemos la ejecución
            }
        }
        catch (error) {
            return res.status(401).send("acceso denegado"); // Enviamos respuesta de error en caso de excepción
        }
    }
};
exports.getToken = getToken;
