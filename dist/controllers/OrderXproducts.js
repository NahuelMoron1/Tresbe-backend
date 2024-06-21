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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrdersXproducts = exports.updateOrderXproducts = exports.postOrderXproducts = exports.deleteOrderXproducts = exports.getOrderXproducts = exports.getOrdersXproducts = void 0;
const orderXproducts_1 = require("../models/mysql/orderXproducts");
const getOrdersXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listOrders = yield orderXproducts_1.OrderXproducts.findAll();
    res.json(listOrders);
});
exports.getOrdersXproducts = getOrdersXproducts;
const getOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(id);
    if (OrderAux) {
        res.json(OrderAux);
    }
    else {
        res.status(404).json({ message: 'Error, OrderXproducts not found' });
    }
});
exports.getOrderXproducts = getOrderXproducts;
const deleteOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(`${id}`);
    if (OrderAux) {
        yield OrderAux.destroy();
        res.json({ message: 'OrderXproducts successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Order not found' });
    }
});
exports.deleteOrderXproducts = deleteOrderXproducts;
const postOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield orderXproducts_1.OrderXproducts.create(body);
    res.json({
        message: 'OrderXproducts successfully created',
    });
});
exports.postOrderXproducts = postOrderXproducts;
const updateOrderXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = yield orderXproducts_1.OrderXproducts.findByPk(id);
    if (OrderAux) {
        OrderAux.update(body);
        res.json({
            message: 'OrderXproducts updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, OrderXproducts not found' });
    }
});
exports.updateOrderXproducts = updateOrderXproducts;
const deleteOrdersXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield orderXproducts_1.OrderXproducts.destroy({ truncate: true });
});
exports.deleteOrdersXproducts = deleteOrdersXproducts;
