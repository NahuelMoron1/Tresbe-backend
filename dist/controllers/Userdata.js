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
exports.deleteUsersdata = exports.updateUserdata = exports.postUserdata = exports.deleteUserdata = exports.getUserdataByUserID = exports.getUserdata = exports.getUsersdata = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const Userdata_1 = __importDefault(require("../models/mysql/Userdata"));
const getUsersdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tokenAux = req.cookies.admin_token;
        let access = req.cookies.access_token;
        if (!access || !tokenAux) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(tokenAux)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const listUsersdata = yield Userdata_1.default.findAll();
        if (!listUsersdata) {
            return res
                .status(404)
                .json({ message: "No se encontraron las listas de data de usuario" });
        }
        return res.status(200).json(listUsersdata);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getUsersdata = getUsersdata;
const verifyAdmin = (adminToken) => {
    const dataAdmin = jsonwebtoken_1.default.verify(adminToken, config_1.SECRET_JWT_KEY);
    if (typeof dataAdmin === "object" && dataAdmin !== null) {
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
const getUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let access = req.cookies.access_token;
        if (!access) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const UserdataAux = yield Userdata_1.default.findByPk(id);
        if (!UserdataAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la data de usuario" });
        }
        return res.status(200).json(UserdataAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getUserdata = getUserdata;
const getUserdataByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let access = req.cookies.access_token;
        if (!access) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const { userid } = req.params;
        const data = jsonwebtoken_1.default.verify(access, config_1.SECRET_JWT_KEY);
        if (typeof data !== "object" || data === null) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const user = data;
        let accessAux = false;
        let i = 0;
        while (i < config_1.admin.length && !accessAux) {
            if (user.email === config_1.admin[i]) {
                accessAux = true;
            }
            else {
                i++;
            }
        }
        if (user.id == userid || access) {
            const UserAux = yield Userdata_1.default.findOne({ where: { userID: userid } });
            if (UserAux) {
                return res.status(200).json(UserAux);
            }
            else {
                res.status(404).json({ message: "Error, Userdata not found" });
            }
        }
        else {
            res.send("Ruta protegida, tu ID no coincide con el id que buscas");
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getUserdataByUserID = getUserdataByUserID;
const deleteUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tokenAux = req.cookies.admin_token;
        let access = req.cookies.access_token;
        if (!access || !tokenAux) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(tokenAux)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const UserdataAux = yield Userdata_1.default.findByPk(`${id}`);
        if (!UserdataAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la data de usuario para eliminar" });
        }
        yield UserdataAux.destroy();
        return res.status(200).json({ message: "Userdata successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteUserdata = deleteUserdata;
const postUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield Userdata_1.default.create(body);
        return res.status(200).json({
            message: "Userdata successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postUserdata = postUserdata;
const updateUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const UserdataAux = yield Userdata_1.default.findByPk(id);
        if (!UserdataAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la data de usuario para modificar" });
        }
        yield UserdataAux.update(body);
        return res.status(200).json({
            message: "Userdata updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateUserdata = updateUserdata;
const deleteUsersdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tokenAux = req.cookies.admin_token;
        let access = req.cookies.access_token;
        if (!access || !tokenAux) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(tokenAux)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        yield Userdata_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Data de usuarios borrada por completo" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteUsersdata = deleteUsersdata;
