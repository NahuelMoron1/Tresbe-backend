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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const listOrders = yield Orders_1.default.findAll();
        res.json(listOrders);
    }
    else {
        res.send('No se puede acceder a las ordenes de compra de la empresa');
    }
});
exports.getOrders = getOrders;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { userid } = req.params;
        if (admin_token) {
            const ordersAux = yield Orders_1.default.findAll({ where: { userID: userid } });
            if (ordersAux) {
                res.json(ordersAux);
            }
            else {
                res.status(404).json({ message: 'Error, orders not found' });
            }
        }
        else {
            const data = jsonwebtoken_1.default.verify(access_token, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User
                if (user.id == userid) {
                    const ordersAux = yield Orders_1.default.findAll({ where: { userID: userid } });
                    if (ordersAux) {
                        res.json(ordersAux);
                    }
                    else {
                        res.status(404).json({ message: 'Error, orders not found' });
                    }
                }
                else {
                    res.send('No podes acceder a ordenes de compra de otros usuarios');
                }
            }
        }
    }
    else {
        res.send('No podes acceder a las ordenes de compra si no estas logueado');
    }
});
exports.getOrdersByUser = getOrdersByUser;
const getOrdersNotPayed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const { userid } = req.params;
        const ordersAux = yield Orders_1.default.findAll({ where: { userId: userid } && { payed: false } });
        if (ordersAux) {
            res.json(ordersAux);
        }
        else {
            res.status(404).json({ message: 'Error, orders not found' });
        }
    }
});
exports.getOrdersNotPayed = getOrdersNotPayed;
const getOrdersAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const ordersAux = yield Orders_1.default.findAll({ where: { attended: 0 } });
        if (ordersAux) {
            res.json(ordersAux);
        }
        else {
            res.status(404).json({ message: 'Error, orders not found' });
        }
    }
});
exports.getOrdersAdmin = getOrdersAdmin;
const searchOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { idcode } = req.params;
        const { userid } = req.params;
        let access = false;
        if (admin_token) {
            access = true;
        }
        else {
            const data = jsonwebtoken_1.default.verify(access_token, config_1.SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data; // Casting si estás seguro que data contiene propiedades de User
                if (user.id == userid) {
                    access = true;
                }
            }
        }
        if (access) {
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
        }
        else {
            res.send('No se puede acceder a los pedidos de otros usuarios');
        }
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
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const { id } = req.params;
        const OrderAux = yield Orders_1.default.findByPk(`${id}`);
        if (OrderAux) {
            yield OrderAux.destroy();
            res.json({ message: 'Order successfully deleted' });
        }
        else {
            res.status(404).json({ message: 'Error, Order not found' });
        }
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
    }
    catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
});
exports.sendEmail = sendEmail;
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { order, to, subject, html, htmlAux } = req.body;
        yield Orders_1.default.create(order);
        yield (0, exports.sendEmail)(to, subject, html);
        let toAux = 'info.tresbedistribuidora@gmail.com';
        yield (0, exports.sendEmail)(toAux, subject, htmlAux);
        res.json({
            message: 'Order successfully created',
        });
    }
    else {
        res.send('No podes comprar sin haber iniciado sesion');
    }
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
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        yield Orders_1.default.destroy({ truncate: true });
    }
    else {
        res.send('Acceso denegado');
    }
});
exports.deleteOrders = deleteOrders;
