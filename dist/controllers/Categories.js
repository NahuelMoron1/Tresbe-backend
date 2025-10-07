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
exports.deleteCategories = exports.updateCategory = exports.postCategory = exports.deleteCategory = exports.getCategory = exports.getCategories = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const Categories_1 = __importDefault(require("../models/mysql/Categories"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listFeatures = yield Categories_1.default.findAll();
        if (!listFeatures) {
            return res
                .status(404)
                .json({ message: "No se encontraron las categorias" });
        }
        return res.status(200).json(listFeatures);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCategories = getCategories;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const CategoryAux = yield Categories_1.default.findByPk(id);
        if (!CategoryAux) {
            return res.status(404).json({ message: "No se encontró esta categoria" });
        }
        return res.status(200).json(CategoryAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCategory = getCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
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
        const CategoryAux = yield Categories_1.default.findByPk(`${id}`);
        if (!CategoryAux) {
            return res.status(404).json({ message: "No se encontró esta categoria" });
        }
        yield Categories_1.default.destroy();
        return res.status(200).json({ message: "Categoria eliminada con exito" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteCategory = deleteCategory;
const postCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const body = req.body;
        yield Categories_1.default.create(body);
        return res.status(200).json({
            message: "Category successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postCategory = postCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const CategoryAux = yield Categories_1.default.findByPk(id);
        if (!CategoryAux) {
            return res
                .status(404)
                .json({ message: "No se encontró esta categoria para actualizar" });
        }
        yield CategoryAux.update(body);
        res.json({
            message: "Categoria actualizada",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        yield Categories_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Todas las categorias fueron borradas" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteCategories = deleteCategories;
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
