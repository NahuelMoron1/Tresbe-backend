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
exports.deleteOrders = exports.updateOrder = exports.postOrder = exports.sendEmail = exports.deleteOrder = exports.getOrder = exports.searchOrders = exports.getOrdersAdmin = exports.getOrdersNotPayed = exports.getOrdersByUser = exports.getOrders = void 0;
const Orders_1 = __importDefault(require("../models/mysql/Orders"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sequelize_1 = require("sequelize");
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
const getOrdersNotPayed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.params;
    const ordersAux = yield Orders_1.default.findAll({ where: { userId: userid } && { payed: false } });
    if (ordersAux) {
        res.json(ordersAux);
    }
    else {
        res.status(404).json({ message: 'Error, orders not found' });
    }
});
exports.getOrdersNotPayed = getOrdersNotPayed;
const getOrdersAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersAux = yield Orders_1.default.findAll({ where: { attended: 0 } });
    if (ordersAux) {
        res.json(ordersAux);
    }
    else {
        res.status(404).json({ message: 'Error, orders not found' });
    }
});
exports.getOrdersAdmin = getOrdersAdmin;
const searchOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idcode } = req.params;
    const { userid } = req.params;
    const searchWords = idcode.split(' ').map(word => word.toLowerCase());
    const whereConditions = {
        [sequelize_1.Op.and]: searchWords.map(word => ({
            code: { [sequelize_1.Op.like]: `%${word}%` }
        }))
    };
    if (userid != undefined && userid != null && userid != '') {
        whereConditions[sequelize_1.Op.and].push({ userID: userid });
    }
    const ordersAux = yield Orders_1.default.findAll({ where: whereConditions });
    if (ordersAux) {
        res.json(ordersAux);
    }
    else {
        res.status(404).json({ message: 'Error, orders not found' });
    }
});
exports.searchOrders = searchOrders;
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
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: 'Gmail', // Puedes usar otro servicio como 'Yahoo', 'Outlook', etc.
        auth: {
            user: 'info.tresbedistribuidora@gmail.com',
            pass: 'tyfd wyjm qnle fgvt'
        }
    });
    let mailOptions = {
        from: 'info.tresbedistribuidora@gmail.com', // Remitente
        to: to, // Destinatario
        subject: subject, // Asunto
        html: text, // Cuerpo del correo en texto plano
        ///html: html // Cuerpo del correo en formato HTML (opcional)
    };
    try {
        let info = yield transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
    }
    catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
});
exports.sendEmail = sendEmail;
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order, to, subject, html, htmlAux } = req.body;
    yield Orders_1.default.create(order);
    yield (0, exports.sendEmail)(to, subject, html);
    let toAux = 'info.tresbedistribuidora@gmail.com';
    yield (0, exports.sendEmail)(toAux, subject, htmlAux);
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
