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
const CartProduct_1 = __importDefault(require("../models/mysql/CartProduct"));
const getCartProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listProducts = yield CartProduct_1.default.findAll();
    res.json(listProducts);
});
exports.getCartProducts = getCartProducts;
const getCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield CartProduct_1.default.findByPk(id);
    if (productAux) {
        res.json(productAux);
    }
    else {
        res.status(404).json({ message: 'Error, CartProduct not found' });
    }
});
exports.getCartProduct = getCartProduct;
const getCartProductsByOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderID } = req.params;
    const productsAux = yield CartProduct_1.default.findAll({ where: { orderID: orderID } });
    if (productsAux) {
        res.json(productsAux);
    }
    else {
        res.status(404).json({ message: 'Error, CartProduct not found' });
    }
});
exports.getCartProductsByOrder = getCartProductsByOrder;
const deleteCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield CartProduct_1.default.findByPk(`${id}`);
    if (productAux) {
        yield productAux.destroy();
        res.json({ message: 'CartProduct successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Cartproduct not found' });
    }
});
exports.deleteCartProduct = deleteCartProduct;
const postCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield CartProduct_1.default.create(body);
    res.json({
        message: 'CartProduct successfully created',
    });
});
exports.postCartProduct = postCartProduct;
const updateCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const productAux = yield CartProduct_1.default.findByPk(id);
    if (productAux) {
        productAux.update(body);
        res.json({
            message: 'CartProduct updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Cartproduct not found' });
    }
});
exports.updateCartProduct = updateCartProduct;
const deleteCartProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield CartProduct_1.default.destroy({ truncate: true });
});
exports.deleteCartProducts = deleteCartProducts;
