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
exports.deleteUsers = exports.updateUser = exports.postUser = exports.deleteUser = exports.getUserByName = exports.getUsersBySeller = exports.getUserByEmail = exports.getUser = exports.getUsers = void 0;
const Users_1 = __importDefault(require("../models/mysql/Users"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUsers = yield Users_1.default.findAll();
    res.json(listUsers);
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const UserAux = yield Users_1.default.findByPk(id);
    if (UserAux) {
        res.json(UserAux);
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.getUser = getUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const UserAux = yield Users_1.default.findOne({ where: { email: email } });
    if (UserAux) {
        res.json(UserAux);
    }
    else {
        res.status(404).json({ message: 'Error, User not found' });
    }
});
exports.getUserByEmail = getUserByEmail;
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
    const body = req.body;
    yield Users_1.default.create(body);
    res.json({
        message: 'User successfully created',
    });
});
exports.postUser = postUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users_1.default.destroy({ truncate: true });
});
exports.deleteUsers = deleteUsers;
