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
exports.deleteOrders = exports.updateOrder = exports.postOrder = exports.deleteOrder = exports.getOrder = exports.getOrdersByUser = exports.getOrders = void 0;
const Orders_1 = __importDefault(require("../models/mysql/Orders"));
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otros servicios como Yahoo, Outlook, etc.
    auth: {
        user: 'info.tresbedistribuidora@gmail.com',
        pass: 'Benfrabel2024'
    }
});
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listOrders = yield Orders_1.default.findAll();
    res.json(listOrders);
});
exports.getOrders = getOrders;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.params;
    const ordersAux = yield Orders_1.default.findAll({ where: { userID: userid } });
    if (ordersAux) {
        res.json(ordersAux);
    }
    else {
        res.status(404).json({ message: 'Error, orders not found' });
    }
});
exports.getOrdersByUser = getOrdersByUser;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OrderAux = yield Orders_1.default.findByPk(id);
    if (OrderAux) {
        res.json(OrderAux);
    }
    else {
        res.status(404).json({ message: 'Error, Order not found' });
    }
});
exports.getOrder = getOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OrderAux = yield Orders_1.default.findByPk(`${id}`);
    if (OrderAux) {
        yield OrderAux.destroy();
        res.json({ message: 'Order successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Order not found' });
    }
});
exports.deleteOrder = deleteOrder;
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield Orders_1.default.create(body);
    res.json({
        message: 'Order successfully created',
    });
});
exports.postOrder = postOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = yield Orders_1.default.findByPk(id);
    if (OrderAux) {
        OrderAux.update(body);
        res.json({
            message: 'Order updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Order not found' });
    }
});
exports.updateOrder = updateOrder;
const deleteOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Orders_1.default.destroy({ truncate: true });
});
exports.deleteOrders = deleteOrders;
