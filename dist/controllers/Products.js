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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const config_1 = require("../models/config");
const Products_1 = __importDefault(require("../models/mysql/Products"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const pageNumb = parseInt(page);
        const pageSize = 12; //Cantidad de elementos por pagina
        const totalProducts = yield Products_1.default.count(); // Obtener el total de productos
        const totalPages = totalProducts / pageSize;
        // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
        const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
        const offset = (validPageNumb - 1) * pageSize;
        const listProducts = yield Products_1.default.findAll({
            limit: pageSize,
            offset: offset,
            order: [
                [connection_1.default.literal(`(brand = 'Tel')`), "DESC"], // Priorizar los productos de marca 'Tel'
                ["category", "ASC"], // Luego ordenar por categoría
                ["stock", "ASC"], // Después ordenar por stock
                ["brand", "ASC"], // Finalmente ordenar alfabéticamente por marca
            ],
        });
        if (!listProducts) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        return res.status(200).json(listProducts);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProducts = getProducts;
const countPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand } = req.params;
        const { type } = req.params;
        if (!brand || !type) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const pageSize = 12; //Cantidad de elementos por pagina
        let totalProducts = 0;
        if (type == "all") {
            totalProducts = yield Products_1.default.count(); // Obtener el total de productos
        }
        else {
            if (type == "brand") {
                totalProducts = yield Products_1.default.count({ where: { brand: brand } }); // Obtener el total de productos
            }
            else {
                totalProducts = yield Products_1.default.count({ where: { category: brand } }); // Obtener el total de productos
            }
        }
        const totalPages = totalProducts / pageSize;
        return res.status(200).json(Math.ceil(totalPages));
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.countPages = countPages;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield Products_1.default.findByPk(id);
        if (!productAux) {
            return res.status(404).json({ message: "No se encontró el producto" });
        }
        return res.status(200).json(productAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProduct = getProduct;
const getProductsByBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand } = req.params;
        const { page } = req.params;
        if (!brand) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
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
            order: [
                ["category", "ASC"], // Ordenar por `category` en orden ascendente
                ["stock", "ASC"], // Ordenar por `category` en orden ascendente
            ],
        });
        if (!productsAux) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        return res.status(200).json(productsAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductsByBrands = getProductsByBrands;
const getRandomProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const products = yield ((_a = Products_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(`SELECT * FROM Products WHERE brand = 'Tel' ORDER BY RAND() LIMIT 3`, {
            type: sequelize_1.QueryTypes.SELECT,
        }));
        if (!products) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getRandomProducts = getRandomProducts;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const { page } = req.params;
        if (!category || !page) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
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
            order: [
                ["category", "ASC"], // Ordenar por `category` en orden ascendente
                ["stock", "ASC"], // Ordenar por `name` en orden ascendente
            ],
        });
        if (productsAux) {
            return res.status(200).json(productsAux);
        }
        else {
            res.status(404).json({ message: "Error, product not found" });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, value, type } = req.params;
        const searchWords = name.split(" ").map((word) => word.toLowerCase());
        const whereConditions = {
            [sequelize_1.Op.and]: searchWords.map((word) => ({
                name: { [sequelize_1.Op.like]: `%${word}%` },
            })),
        };
        // Agregar la condición de brand si no es 'all'
        if (value !== "" && value != "all") {
            if (type == "brand") {
                whereConditions[sequelize_1.Op.and].push({ brand: value });
            }
            else if (type == "category") {
                whereConditions[sequelize_1.Op.and].push({ category: value });
            }
        }
        // Construimos la consulta para buscar todas las palabras
        const productsAux = yield Products_1.default.findAll({
            where: whereConditions,
            order: [
                ["category", "ASC"], // Ordenar por `category` en orden ascendente
                ["name", "ASC"], // Ordenar por `name` en orden ascendente
            ],
        });
        if (!productsAux) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }
        return res.status(200).json(productsAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getProductsBySearch = getProductsBySearch;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin_token = req.cookies.admin_token;
        const access_token = req.cookies.access_token;
        if (!access_token || !admin_token) {
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
        const productAux = yield Products_1.default.findByPk(`${id}`);
        if (!productAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el producto a eliminar" });
        }
        yield productAux.destroy();
        return res.status(200).json({ message: "Product successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteProduct = deleteProduct;
const postProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin_token = req.cookies.admin_token;
        const access_token = req.cookies.access_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const body = req.body;
        if (!validateProduct(body)) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        yield Products_1.default.create(body);
        return res.status(200).json({
            message: "Product successfully created",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postProduct = postProduct;
function validateProduct(body) {
    if (!body.name ||
        typeof body.name !== "string" ||
        !body.category ||
        typeof body.category !== "string" ||
        !body.image ||
        typeof body.image !== "string" ||
        !body.brand ||
        typeof body.brand !== "string") {
        return false;
    }
    return true;
}
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield Products_1.default.findByPk(id);
        if (!productAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el producto a actualizar" });
        }
        yield productAux.update(body);
        return res.status(200).json({
            message: "Product updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        yield Products_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Todos los productos fueron eliminados" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteProducts = deleteProducts;
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
        return access;
    }
    else {
        return false;
    }
};
