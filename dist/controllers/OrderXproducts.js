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
exports.deleteOrdersXproducts = exports.updateOrderXproducts = exports.postOrderXproducts = exports.deleteOrderXproductsByIDs = exports.deleteOrderXproducts = exports.getOxpByOrders = exports.getOrderXproducts = exports.getOrdersXproducts = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const orderXproducts_1 = require("../models/mysql/orderXproducts");
const getOrdersXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const listOrders = yield orderXproducts_1.OrderXproducts.findAll();
        if (!listOrders) {
            return res
                .status(404)
                .json({ message: "No se encontraron ordenes con productos" });
        }
        return res.status(200).json(listOrders);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getOrdersXproducts = getOrdersXproducts;
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
const getOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        let access = req.cookies.access_token;
        if (!access) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const data = jsonwebtoken_1.default.verify(access, config_1.SECRET_JWT_KEY);
        if (typeof data !== "object" || data === null) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const user = data; // Casting si estás seguro que data contiene propiedades de User
        if (user.id !== id && !verifyAdmin(access)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(id);
        if (!OrderAux) {
            return res
                .status(404)
                .json({ message: "No se encontro la orden con producto" });
        }
        return res.status(200).json(OrderAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getOrderXproducts = getOrderXproducts;
const getOxpByOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderid } = req.params;
        if (!orderid || typeof orderid !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const ordersAux = yield orderXproducts_1.OrderXproducts.findAll({
            where: { orderId: orderid },
        });
        if (!ordersAux) {
            return res
                .status(404)
                .json({ message: "No se encontraron las ordenes con productos" });
        }
        return res.status(200).json(ordersAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getOxpByOrders = getOxpByOrders;
const deleteOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(`${id}`);
        if (!OrderAux) {
            return res.status(404).json({
                message: "No se encontro la orden con producto para eliminar",
            });
        }
        yield OrderAux.destroy();
        return res
            .status(200)
            .json({ message: "OrderXproducts successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOrderXproducts = deleteOrderXproducts;
const deleteOrderXproductsByIDs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { productID } = req.params;
        const { orderID } = req.params;
        if (!productID ||
            typeof productID !== "string" ||
            !orderID ||
            typeof orderID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OrderAux = yield orderXproducts_1.OrderXproducts.findOne({
            where: {
                productId: productID,
                orderId: orderID,
            },
        });
        if (!OrderAux) {
            return res.status(404).json({
                message: "No se encontro la orden con producto para eliminar",
            });
        }
        yield OrderAux.destroy();
        return res
            .status(200)
            .json({ message: "OrderXproducts successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOrderXproductsByIDs = deleteOrderXproductsByIDs;
const postOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let access = req.cookies.access_token;
        const body = req.body;
        if (!access) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        yield orderXproducts_1.OrderXproducts.create(body);
        return res.status(200).json({
            message: "OrderXproducts successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postOrderXproducts = postOrderXproducts;
const updateOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(id);
        if (!OrderAux) {
            return res.status(404).json({
                message: "No se encontro la orden con producto para modificar",
            });
        }
        yield OrderAux.update(body);
        return res.status(200).json({
            message: "OrderXproducts updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateOrderXproducts = updateOrderXproducts;
const deleteOrdersXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield orderXproducts_1.OrderXproducts.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Ordenes con productos eliminadas por completo" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteOrdersXproducts = deleteOrdersXproducts;
