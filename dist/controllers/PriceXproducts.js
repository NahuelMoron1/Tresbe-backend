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
exports.deletePriceXproducts = exports.updatePriceXproduct = exports.postPriceXproduct = exports.deletePriceXproduct = exports.getTableByProduct = exports.getPriceXproduct = exports.getPriceXproducts = void 0;
const PriceXproducts_1 = __importDefault(require("../models/mysql/PriceXproducts"));
const getPriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listProducts = yield PriceXproducts_1.default.findAll();
    res.json(listProducts);
});
exports.getPriceXproducts = getPriceXproducts;
const getPriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield PriceXproducts_1.default.findByPk(id);
    if (productAux) {
        res.json(productAux);
    }
    else {
        res.status(404).json({ message: 'Error, Product not found' });
    }
});
exports.getPriceXproduct = getPriceXproduct;
const getTableByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { optionID } = req.params;
    const tableAux = yield PriceXproducts_1.default.findOne({ where: { optionID: optionID } });
    if (tableAux) {
        res.json(tableAux);
    }
    else {
        res.status(404).json({ message: 'Error, Userdata not found' });
    }
});
exports.getTableByProduct = getTableByProduct;
const deletePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productAux = yield PriceXproducts_1.default.findByPk(`${id}`);
    if (productAux) {
        yield productAux.destroy();
        res.json({ message: 'Product successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.deletePriceXproduct = deletePriceXproduct;
const postPriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield PriceXproducts_1.default.create(body);
    res.json({
        message: 'Product successfully created',
    });
});
exports.postPriceXproduct = postPriceXproduct;
const updatePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const productAux = yield PriceXproducts_1.default.findByPk(id);
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
exports.updatePriceXproduct = updatePriceXproduct;
const deletePriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield PriceXproducts_1.default.destroy({ truncate: true });
});
exports.deletePriceXproducts = deletePriceXproducts;
