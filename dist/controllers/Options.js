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
exports.deleteOptions = exports.updateOption = exports.postOption = exports.deleteOption = exports.deleteOptionByProduct = exports.getProductOptionsByName = exports.getProductOptionsByTwo = exports.getProductOptions = exports.getOption = exports.getOptions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const Options_1 = __importDefault(require("../models/mysql/Options"));
const getOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const listOptions = yield Options_1.default.findAll();
        if (!listOptions) {
            return res.status(404).json({ message: "No se encontraron opciones" });
        }
        return res.status(200).json(listOptions);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getOptions = getOptions;
const getOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        console.log("ON GET OPTION");
        const OptionAux = yield Options_1.default.findByPk(id);
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        return res.status(200).json(OptionAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getOption = getOption;
const getProductOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        if (!productID || typeof productID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OptionAux = yield Options_1.default.findAll({
            where: { productID: productID },
        });
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        return res.status(200).json(OptionAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductOptions = getProductOptions;
const getProductOptionsByTwo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        const { optionName } = req.params;
        const optionValid = decodeURIComponent(optionName);
        if (!productID ||
            typeof productID !== "string" ||
            !optionName ||
            typeof optionName !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OptionAux = yield Options_1.default.findOne({
            where: { name: optionValid, productID: productID },
        });
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        return res.status(200).json(OptionAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductOptionsByTwo = getProductOptionsByTwo;
const getProductOptionsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        if (!name || typeof name !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OptionAux = yield Options_1.default.findOne({ where: { name: name } });
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        return res.status(200).json(OptionAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductOptionsByName = getProductOptionsByName;
const deleteOptionByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const OptionAux = yield Options_1.default.findAll({ where: { productID: id } });
        if (!OptionAux || OptionAux.length <= 0) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        if (OptionAux.length < 2) {
            yield OptionAux[0].destroy();
        }
        else {
            for (let i = 0; i < OptionAux.length; i++) {
                yield OptionAux[i].destroy();
            }
        }
        return res.status(200).json({ message: "Options successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOptionByProduct = deleteOptionByProduct;
const deleteOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const OptionAux = yield Options_1.default.findByPk(`${id}`);
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        yield OptionAux.destroy();
        return res.status(200).json({ message: "Option successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOption = deleteOption;
const postOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const body = req.body;
        if (!validateOption(body)) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa los datos que enviaste",
            });
        }
        yield Options_1.default.create(body);
        return res.status(200).json({
            message: "Option successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postOption = postOption;
function validateOption(body) {
    if (!body.productID ||
        typeof body.productID !== "string" ||
        !body.name ||
        typeof body.name !== "string" ||
        (body.stock && typeof body.stock !== "number")) {
        return false;
    }
    return true;
}
const updateOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { oldID } = req.params;
        if (!oldID || typeof oldID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OptionAux = yield Options_1.default.findByPk(oldID);
        if (!OptionAux) {
            return res.status(404).json({ message: "No se encontró la opcion" });
        }
        let varaux = yield Options_1.default.update({
            id: body.id,
            name: body.name,
            productID: body.productID,
            stock: body.stock,
        }, { where: { id: oldID } });
        return res.status(200).json({
            message: "Option updated",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateOption = updateOption;
const deleteOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Options_1.default.destroy({ truncate: true });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOptions = deleteOptions;
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
        return access;
    }
    else {
        return false;
    }
};
