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
exports.deleteProducts = exports.updateProduct = exports.postProduct = exports.deleteProduct = exports.getProductsBySearch = exports.getProductsByCategory = exports.getRandomProducts = exports.getProductsByBrands = exports.getProduct = exports.countPages = exports.getProducts = void 0;
const Products_1 = __importDefault(require("../models/mysql/Products"));
const sequelize_1 = require("sequelize");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = yield Products_1.default.count(); // Obtener el total de productos
    const totalPages = (totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;
    const listProducts = yield Products_1.default.findAll({
        limit: pageSize,
        offset: offset,
    });
    res.json(listProducts);
});
exports.getProducts = getProducts;
const countPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand } = req.params;
    const { type } = req.params;
    const pageSize = 12; //Cantidad de elementos por pagina
    let totalProducts = 0;
    if (type == 'all') {
        totalProducts = yield Products_1.default.count(); // Obtener el total de productos
    }
    else {
        if (type == 'brand') {
            console.log("BRAND");
            console.log("BRAND");
            console.log("BRAND");
            console.log("BRAND");
            console.log("BRAND");
            console.log("BRAND");
            totalProducts = yield Products_1.default.count({ where: { brand: brand } }); // Obtener el total de productos
        }
        else {
            totalProducts = yield Products_1.default.count({ where: { category: brand } }); // Obtener el total de productos
        }
    }
    const totalPages = (totalProducts / pageSize);
    res.json(Math.ceil(totalPages));
});
exports.countPages = countPages;
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
const getProductsByBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand } = req.params;
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = yield Products_1.default.count(); // Obtener el total de productos
    const totalPages = Math.ceil(totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;
    const productsAux = yield Products_1.default.findAll({
        where: { brand: brand },
        limit: pageSize,
        offset: offset,
    });
    if (productsAux) {
        res.json(productsAux);
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.getProductsByBrands = getProductsByBrands;
const getRandomProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const products = yield ((_a = Products_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(`SELECT * FROM Products ORDER BY RAND() LIMIT 3`, {
        type: sequelize_1.QueryTypes.SELECT
    }));
    if (products) {
        res.json(products);
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.getRandomProducts = getRandomProducts;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    const { brand } = req.params;
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = yield Products_1.default.count(); // Obtener el total de productos
    const totalPages = Math.ceil(totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;
    const productsAux = yield Products_1.default.findAll({
        where: { category: category },
        limit: pageSize,
        offset: offset,
    });
    if (productsAux) {
        res.json(productsAux);
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand } = req.params;
    const searchWords = name.split(' ').map(word => word.toLowerCase());
    const whereConditions = {
        [sequelize_1.Op.and]: searchWords.map(word => ({
            name: { [sequelize_1.Op.like]: `%${word}%` }
        }))
    };
    // Agregar la condición de brand si no es 'all'
    if (brand !== '' && brand != 'all') {
        whereConditions[sequelize_1.Op.and].push({ brand: brand });
    }
    // Construimos la consulta para buscar todas las palabras
    const productsAux = yield Products_1.default.findAll({
        where: whereConditions
    });
    if (productsAux) {
        res.json(productsAux);
    }
    else {
        res.status(404).json({ message: 'Error, product not found' });
    }
});
exports.getProductsBySearch = getProductsBySearch;
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
