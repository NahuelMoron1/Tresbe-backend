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
exports.deletePriceXproducts = exports.updateOptionID = exports.updatePriceXproduct = exports.postPriceXproduct = exports.deletePriceXproduct = exports.deletePriceXproductByOptionID = exports.getTableByProduct = exports.getPriceXproduct = exports.getPriceXproducts = void 0;
const PriceXproducts_1 = __importDefault(require("../models/mysql/PriceXproducts"));
const config_1 = require("../models/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../models/config");
const getPriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const listProducts = yield PriceXproducts_1.default.findAll();
            res.json(listProducts);
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
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
const deletePriceXproductByOptionID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const productAux = yield PriceXproducts_1.default.findOne({ where: { optionID: id } });
    if (productAux) {
        yield productAux.destroy();
        return 'DELETED';
    }
    else {
        return 'Error';
    }
});
exports.deletePriceXproductByOptionID = deletePriceXproductByOptionID;
const deletePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const productAux = yield PriceXproducts_1.default.findByPk(`${id}`);
            if (productAux) {
                yield productAux.destroy();
                res.json({ message: 'Product successfully deleted' });
            }
            else {
                res.status(404).json({ message: 'Error, product not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.deletePriceXproduct = deletePriceXproduct;
const postPriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            yield PriceXproducts_1.default.create(body);
            res.json({
                message: 'Product successfully created',
            });
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.postPriceXproduct = postPriceXproduct;
const updatePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const productAux = yield PriceXproducts_1.default.findByPk(id);
    if (productAux) {
        yield productAux.update(body);
        res.json({
            message: 'Product updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.updatePriceXproduct = updatePriceXproduct;
const updateOptionID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const productAux = yield PriceXproducts_1.default.findOne({ where: { optionID: id } });
    if (typeof productAux === 'object' && productAux != null) {
        const pricesAux = productAux;
        pricesAux.optionID = body.optionID;
        ///await productAux.update(pricesAux);
        yield PriceXproducts_1.default.update({ optionID: pricesAux.optionID }, { where: { id: pricesAux.id } });
        res.json({
            message: 'OPTION ID updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.updateOptionID = updateOptionID;
const deletePriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            yield PriceXproducts_1.default.destroy({ truncate: true });
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Ruta protegida');
    }
});
exports.deletePriceXproducts = deletePriceXproducts;
const verifyAdmin = (adminToken) => {
    const dataAdmin = jsonwebtoken_1.default.verify(adminToken, config_2.SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
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
