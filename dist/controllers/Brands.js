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
exports.deleteBrands = exports.updateBrand = exports.postBrands = exports.deleteBrand = exports.getBrand = exports.getBrands = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../db/connection"));
const config_1 = require("../models/config");
const Brands_1 = __importDefault(require("../models/mysql/Brands"));
const getBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listBrands = yield Brands_1.default.findAll({
            order: [
                // Primero ponemos las marcas cuyo nombre es 'Tel'
                [connection_1.default.literal(`CASE WHEN name = 'Tel' THEN 0 ELSE 1 END`), "ASC"],
                // Luego ordenamos las demás marcas en orden descendente por name
                ["name", "DESC"],
            ],
        });
        if (!listBrands) {
            return res.status(404).json({ message: "No se encontraron las marcas" });
        }
        return res.json(listBrands);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getBrands = getBrands;
const getBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const BrandAux = yield Brands_1.default.findByPk(id);
        if (!BrandAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la marca buscada" });
        }
        return res.json(BrandAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getBrand = getBrand;
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const BrandAux = yield Brands_1.default.findByPk(`${id}`);
        if (!BrandAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la marca buscada para eliminar" });
        }
        yield BrandAux.destroy();
        return res.status(200).json({ message: "Brand successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteBrand = deleteBrand;
const postBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!validateBrand(body)) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        yield Brands_1.default.create(body);
        res.status(200).json({
            message: "Marca creada con exito",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postBrands = postBrands;
function validateBrand(body) {
    if (!body.name ||
        !body.image ||
        typeof body.name !== "string" ||
        typeof body.image !== "string") {
        return false;
    }
    return true;
}
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const BrandsAux = yield Brands_1.default.findByPk(id);
        if (!BrandsAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la marca buscada para eliminar" });
        }
        yield BrandsAux.update(body);
        res.json({
            message: "Brand updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateBrand = updateBrand;
const deleteBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Brands_1.default.destroy({ truncate: true });
        return res.status(200).json({ message: "todas las marcas borradas" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteBrands = deleteBrands;
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
