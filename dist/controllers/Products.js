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
exports.deleteProducts = exports.updateProduct = exports.postProduct = exports.deleteProduct = exports.getProduct = exports.getProducts = void 0;
const Products_1 = __importDefault(require("../models/mysql/Products"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listProducts = yield Products_1.default.findAll();
    res.json(listProducts);
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield Products_1.default.findByPk(id);
    if (productAux) {
        res.json(productAux);
    }
    else {
        res.status(404).json({ message: 'Error, Product not found' });
    }
});
exports.getProduct = getProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield Products_1.default.findByPk(`${id}`);
    if (productAux) {
        yield productAux.destroy();
        res.json({ message: 'Product successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.deleteProduct = deleteProduct;
const postProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield Products_1.default.create(body);
    res.json({
        message: 'Product successfully created',
    });
});
exports.postProduct = postProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const productAux = yield Products_1.default.findByPk(id);
    if (productAux) {
        productAux.update(body);
        res.json({
            message: 'Product updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.updateProduct = updateProduct;
const deleteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Products_1.default.destroy({ truncate: true });
});
exports.deleteProducts = deleteProducts;
