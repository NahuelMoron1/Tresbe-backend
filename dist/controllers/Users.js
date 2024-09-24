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
exports.deleteUsers = exports.updateUser = exports.postUser = exports.deleteUser = exports.getUserByName = exports.getUsersBySeller = exports.logout = exports.login = exports.temporalLogin = exports.getUserByEmail = exports.getUser = exports.getUsers = void 0;
const Users_1 = __importDefault(require("../models/mysql/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const config_1 = require("../models/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../models/config");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    if (email != config_1.admin) {
        const listUsers = yield Users_1.default.findAll();
        let users = [];
        if (listUsers) {
            users = listUsers.map(user => user.toJSON());
        }
        res.json(users);
    }
    else if (email == config_1.admin) {
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
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = req.params;
    if (email != config_1.admin) {
        const UserAux = yield Users_1.default.findByPk(id);
        if (UserAux) {
            res.json(UserAux);
        }
        else {
            res.status(404).json({ message: 'Error, User not found' });
        }
    }
    else {
        const UserAux = yield Users_1.default.scope('withAll').findByPk(id);
        if (UserAux) {
            res.json(UserAux);
        }
        else {
            res.status(404).json({ message: 'Error, User not found' });
        }
    }
});
exports.getUser = getUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, loggedEmail } = req.params;
    if (loggedEmail != config_1.admin) {
        const UserAux = yield Users_1.default.scope('withAll').findOne({ where: { email: email } });
        if (UserAux) {
            res.json(UserAux);
        }
        else {
            res.status(404).json({ message: 'Error, User not found' });
        }
    }
    else {
        const UserAux = yield Users_1.default.scope('withAll').findOne({ where: { email: email } });
        if (UserAux) {
            res.json(UserAux);
        }
        else {
            res.status(404).json({ message: 'Error, User not found' });
        }
    }
});
exports.getUserByEmail = getUserByEmail;
const temporalLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userAux = yield loginCheck(email, password);
    let userValidated = new User_1.User('', '', '', '', false, '', '');
    if (userAux != null) {
        userValidated = userAux;
        res.json(userValidated);
    }
    else {
        res.status(404).json({ message: 'Error al iniciar sesion' });
    }
});
exports.temporalLogin = temporalLogin;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userAux = yield loginCheck(email, password);
    let userValidated = new User_1.User('', '', '', '', false, '', '');
    if (userAux != null) {
        userValidated = userAux;
        const access_token = jsonwebtoken_1.default.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client }, config_2.SECRET_JWT_KEY, {
            expiresIn: "1h"
        });
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true, ///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            maxAge: 1000 * 60 * 60
        });
        if (userValidated.email == config_1.admin) {
            const admin_token = jsonwebtoken_1.default.sign({ id: userValidated.id, email: userValidated.email, username: userValidated.username, priceList: userValidated.priceList, client: userValidated.client }, config_2.SECRET_JWT_KEY, {
                expiresIn: "1h"
            });
            res.cookie('admin_token', admin_token, {
                httpOnly: true,
                secure: true, ///process.env.NODE_ENV == 'production',
                sameSite: 'none',
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
const logout = (req, res) => {
    // Elimina la cookie 'access_token'
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true, // Asegúrate de que coincida con cómo se configuró la cookie
        sameSite: 'none'
    });
    // También puedes eliminar cualquier otra cookie, como 'admin_token'
    res.clearCookie('admin_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};
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
    const { seller } = req.params;
    const UserAux = yield Users_1.default.findAll({ where: { seller: seller } });
    if (UserAux) {
        res.json(UserAux);
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.getUsersBySeller = getUsersBySeller;
const getUserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const UserAux = yield Users_1.default.findOne({ where: { username: username } });
    if (UserAux) {
        res.json(UserAux);
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.getUserByName = getUserByName;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const UserAux = yield Users_1.default.findByPk(`${id}`);
    if (UserAux) {
        yield UserAux.destroy();
        res.json({ message: 'User successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.deleteUser = deleteUser;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.postUser = postUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    body.password = yield bcrypt_1.default.hash(body.password, 10);
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
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users_1.default.destroy({ truncate: true });
});
exports.deleteUsers = deleteUsers;
