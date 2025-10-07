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
exports.deleteFeatures = exports.updateFeature = exports.postFeature = exports.deleteFeature = exports.getProductFeatures = exports.getFeature = exports.getFeatures = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const Features_1 = __importDefault(require("../models/mysql/Features"));
const getFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const listFeatures = yield Features_1.default.findAll();
        if (!listFeatures) {
            return res
                .status(404)
                .json({ message: "No se encontraron las caracteristicas" });
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
exports.getFeatures = getFeatures;
const getFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const FeatureAux = yield Features_1.default.findByPk(id);
        if (!FeatureAux) {
            return res
                .status(404)
                .json({ message: "No se encontraron las caracteristicas" });
        }
        return res.status(200).json(FeatureAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getFeature = getFeature;
const getProductFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        if (!productID || typeof productID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const FeatureAux = yield Features_1.default.findAll({
            where: { product_id: productID },
        });
        if (!FeatureAux) {
            return res
                .status(404)
                .json({ message: "No se encontraron las caracteristicas" });
        }
        return res.status(200).json(FeatureAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductFeatures = getProductFeatures;
const deleteFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const FeatureAux = yield Features_1.default.findByPk(`${id}`);
        if (!FeatureAux) {
            return res
                .status(404)
                .json({ message: "No se encontraron las caracteristicas" });
        }
        yield FeatureAux.destroy();
        return res.status(200).json({ message: "Feature successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteFeature = deleteFeature;
const postFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!validateFeature(body)) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa los datos que enviaste",
            });
        }
        yield Features_1.default.create(body);
        return res.status(200).json({
            message: "Feature successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postFeature = postFeature;
function validateFeature(body) {
    if (!body.product_id ||
        typeof body.product_id !== "string" ||
        !body.name ||
        typeof body.name !== "string") {
        return false;
    }
    return true;
}
const updateFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const FeatureAux = yield Features_1.default.findByPk(id);
        if (!FeatureAux) {
            return res
                .status(404)
                .json({ message: "No se encontraron las caracteristicas" });
        }
        yield FeatureAux.update(body);
        return res.status(200).json({
            message: "Feature updated",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateFeature = updateFeature;
const deleteFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Features_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Caracteristicas eliminadas correctamente" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteFeatures = deleteFeatures;
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
