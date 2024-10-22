"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.updatePassword = exports.updateUser = exports.postUser = exports.deleteUser = exports.getUserByName = exports.getUsersBySeller = exports.logout = exports.login = exports.getUserByEmail = exports.getUser = exports.getUsers = void 0;
const Users_1 = __importDefault(require("../models/mysql/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const PublicUser_1 = require("../models/PublicUser");
const config_1 = require("../models/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../models/config");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { email } = req.params;
            let access = false;
            let i = 0;
            while (i < config_1.admin.length && !access) {
                if (email === config_1.admin[i]) {
                    access = true;
                }
                else {
                    i++;
                }
            }
            if (!access) {
                const listUsers = yield Users_1.default.findAll();
                let users = [];
                if (listUsers) {
                    users = listUsers.map(user => user.toJSON());
                }
                res.json(users);
            }
            else if (access) {
                const listUsers = yield Users_1.default.scope('withAll').findAll();
                let users = [];
                if (listUsers) {
                    users = listUsers.map(user => user.toJSON());
                }
                res.json(users);
            }
            else {
                res.status(501).json({ message: "Bad Request for users" });
            }
        }
        else {
            res.send('Ruta protegid');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.access_token;
    let user = new PublicUser_1.PublicUser('', '', '', '', '', '');
    if (tokenAux) {
        let userAux = yield getToken(tokenAux);
        if (userAux) {
            user = userAux;
        }
        const { id } = req.params;
        let access = false;
        let i = 0;
        while (i < config_1.admin.length && !access) {
            if (user.email === config_1.admin[i]) {
                access = true;
            }
            else {
                i++;
            }
        }
        if (access) {
            const UserAux = yield Users_1.default.scope('withAll').findByPk(id);
            if (UserAux) {
                res.json(UserAux);
            }
            else {
                res.status(404).json({ message: 'Error, User not found' });
            }
        }
        else {
            if (user.id === id) {
                const UserAux = yield Users_1.default.scope('withAll').findByPk(id);
                if (UserAux) {
                    res.json(UserAux);
                }
                else {
                    res.status(404).json({ message: 'Error, User not found' });
                }
            }
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.getUser = getUser;
function getToken(tokenAux) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new PublicUser_1.PublicUser('', '', '', '', '', '');
        try {
            const data = jsonwebtoken_1.default.verify(tokenAux, config_2.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                user = data; // Casting si estás seguro que data contiene propiedades de User
                return user;
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    });
}
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { email } = req.params;
            const UserAux = yield Users_1.default.scope('withAll').findOne({ where: { email: email } });
            if (UserAux) {
                res.json(UserAux);
            }
            else {
                res.status(404).json({ message: 'Error, User not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.getUserByEmail = getUserByEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userAux = yield loginCheck(email, password);
    let userValidated = new User_1.User('', '', '', '', false, '', '');
    if (userAux != null) {
        userValidated = userAux;
        const access_token = jsonwebtoken_1.default.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client, seller: userValidated.seller }, config_2.SECRET_JWT_KEY, {
            expiresIn: "1h"
        });
        const refresh_token = jsonwebtoken_1.default.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client, seller: userValidated.seller }, config_2.SECRET_JWT_KEY, {
            expiresIn: "1d"
        });
        res.cookie('access_token', access_token, {
            path: '/',
            httpOnly: true,
            secure: true, ///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 1000 * 60 * 60
        });
        res.cookie('refresh_token', refresh_token, {
            path: '/',
            httpOnly: true,
            secure: true, ///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 1000 * 60 * 60 * 24
        });
        let access = false;
        let i = 0;
        while (i < config_1.admin.length && !access) {
            if (userValidated.email === config_1.admin[i]) {
                access = true;
            }
            else {
                i++;
            }
        }
        if (access) {
            const admin_token = jsonwebtoken_1.default.sign({ id: userValidated.id, email: userValidated.email, username: userValidated.username, priceList: userValidated.priceList, client: userValidated.client, seller: userValidated.seller }, config_2.SECRET_JWT_KEY, {
                expiresIn: "1h"
            });
            res.cookie('admin_token', admin_token, {
                path: '/',
                httpOnly: true,
                secure: true, ///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                sameSite: 'none',
                domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                maxAge: 1000 * 60 * 60
            });
            res.send({ userValidated, access_token, admin_token });
        }
        else {
            res.send({ userValidated, access_token });
        }
    }
    else {
        res.status(404).json({ message: 'Error al iniciar sesion' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (token) {
        const admin = req.cookies.admin_token;
        res.cookie('refresh_token', '', {
            path: '/',
            httpOnly: true,
            secure: true, ///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 0
        });
        res.cookie('access_token', '', {
            path: '/',
            httpOnly: true,
            secure: true, ///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 0
        });
        if (admin) {
            res.cookie('admin_token', '', {
                path: '/',
                httpOnly: true,
                secure: true, ///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                sameSite: 'none',
                maxAge: 0
            });
        }
        res.send('finish');
    }
});
exports.logout = logout;
function loginCheck(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.default.scope('withAll').findOne({ where: { email: email } });
        let userAux = new User_1.User('', '', '', '', false, '', '');
        if (user != null) {
            userAux = user.toJSON();
            let access = yield bcrypt_1.default.compare(password, userAux.password);
            if (access) {
                return userAux;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
}
const getUsersBySeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { seller } = req.params;
            const UserAux = yield Users_1.default.findAll({ where: { seller: seller } });
            if (UserAux) {
                res.json(UserAux);
            }
            else {
                res.status(404).json({ message: 'Error, User not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.getUsersBySeller = getUsersBySeller;
const getUserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let access = req.cookies['access_token'];
    let tokenAux = req.cookies['admin_token'];
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { username } = req.params;
            const UserAux = yield Users_1.default.findOne({ where: { username: username } });
            if (UserAux) {
                res.json(UserAux);
            }
            else {
                res.status(404).json({ message: 'Error, User not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.getUserByName = getUserByName;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const UserAux = yield Users_1.default.findByPk(`${id}`);
            if (UserAux) {
                yield UserAux.destroy();
                res.json({ message: 'User successfully deleted' });
            }
            else {
                res.status(404).json({ message: 'Error, User not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.deleteUser = deleteUser;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            let { id, email, username, priceList, client, seller, password } = req.body;
            let hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = {
                id,
                email,
                username,
                priceList,
                client,
                seller,
                password: hashedPassword // Guardar la contraseña hasheada
            };
            yield Users_1.default.create(user);
            res.json({
                message: `User successfully created with hashed password: ${user}`,
            });
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.postUser = postUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;*/
    const body = req.body;
    const { id } = req.params;
    const UserAux = yield Users_1.default.findByPk(id);
    if (UserAux) {
        UserAux.update(body);
        res.json({
            message: 'User updated',
        });
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.updateUser = updateUser;
const verifyAdmin = (adminToken) => {
    const dataAdmin = jsonwebtoken_1.default.verify(adminToken, config_2.SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
        const userAux = dataAdmin;
        let access = false;
        let i = 0;
        while (i < config_1.admin.length && !access) {
            if (userAux.email === config_1.admin[i]) {
                access = true;
            }
            else {
                i++;
            }
        }
        if (access) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        const body = req.body;
        const { id } = req.params;
        const UserAux = yield Users_1.default.findByPk(id);
        if (UserAux) {
            body.password = yield bcrypt_1.default.hash(body.password, 10);
            UserAux.update(body);
            res.json({
                message: 'User updated',
            });
        }
        else {
            res.status(404).json({ message: 'Error, User not found' });
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.updatePassword = updatePassword;
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            yield Users_1.default.destroy({ truncate: true });
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.deleteUsers = deleteUsers;
