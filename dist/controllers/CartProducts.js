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
exports.deleteCartProducts = exports.updateCartProduct = exports.postCartProduct = exports.deleteCartProduct = exports.getCartProductsByOrder = exports.getCartProduct = exports.getCartProducts = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const CartProduct_1 = __importDefault(require("../models/mysql/CartProduct"));
const getCartProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const listProducts = yield CartProduct_1.default.findAll();
        if (!listProducts) {
            return res
                .status(404)
                .json({ message: "No se encontraron productos del carrito" });
        }
        return res.status(200).json(listProducts);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCartProducts = getCartProducts;
const getCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield CartProduct_1.default.findByPk(id);
        if (!productAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el producto de carrito" });
        }
        return res.status(200).json(productAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCartProduct = getCartProduct;
const getCartProductsByOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID } = req.params;
        if (!orderID || typeof orderID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productsAux = yield CartProduct_1.default.findAll({
            where: { orderID: orderID },
        });
        if (!productsAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el producto de carrito" });
        }
        return res.status(200).json(productsAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCartProductsByOrder = getCartProductsByOrder;
const deleteCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const productAux = yield CartProduct_1.default.findByPk(`${id}`);
        if (!productAux) {
            return res.status(404).json({
                message: "No se encontró el producto de carrito buscado para eliminar",
            });
        }
        yield productAux.destroy();
        res.status(200).json({ message: "Producto de carrito borrado con exito" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteCartProduct = deleteCartProduct;
const postCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        if (!access_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const body = req.body;
        yield CartProduct_1.default.create(body);
        return res.status(200).json({
            message: "Producto de carrito guardado correctamente",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postCartProduct = postCartProduct;
const updateCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield CartProduct_1.default.findByPk(id);
        if (!productAux) {
            return res.status(404).json({
                message: "No se encontró el producto de carrito buscado para actualizar",
            });
        }
        yield productAux.update(body);
        return res.status(200).json({
            message: "Producto de carrito actualizado con exito",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateCartProduct = updateCartProduct;
const deleteCartProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield CartProduct_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Productos de carrito eliminados con exito" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteCartProducts = deleteCartProducts;
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
