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
exports.deleteBrands = exports.updateBrand = exports.postBrands = exports.deleteBrand = exports.getBrand = exports.getBrands = void 0;
const Brands_1 = __importDefault(require("../models/mysql/Brands"));
const connection_1 = __importDefault(require("../db/connection"));
const config_1 = require("../models/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../models/config");
const getBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listBrands = yield Brands_1.default.findAll({
        order: [
            // Primero ponemos las marcas cuyo nombre es 'Tel'
            [connection_1.default.literal(`CASE WHEN name = 'Tel' THEN 0 ELSE 1 END`), 'ASC'],
            // Luego ordenamos las demás marcas en orden descendente por name
            ['name', 'DESC']
        ]
    });
    res.json(listBrands);
});
exports.getBrands = getBrands;
const getBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const BrandAux = yield Brands_1.default.findByPk(id);
    if (BrandAux) {
        res.json(BrandAux);
    }
    else {
        res.status(404).json({ message: 'Error, Brand not found' });
    }
});
exports.getBrand = getBrand;
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const BrandAux = yield Brands_1.default.findByPk(`${id}`);
            if (BrandAux) {
                yield BrandAux.destroy();
                res.json({ message: 'Brand successfully deleted' });
            }
            else {
                res.status(404).json({ message: 'Error, Brand not found' });
            }
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.deleteBrand = deleteBrand;
const postBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            yield Brands_1.default.create(body);
            res.json({
                message: 'Brand successfully created',
            });
        }
        else {
            res.send('Ruta protegida');
        }
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.postBrands = postBrands;
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const BrandsAux = yield Brands_1.default.findByPk(id);
    if (BrandsAux) {
        BrandsAux.update(body);
        res.json({
            message: 'Brand updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Brand not found' });
    }
});
exports.updateBrand = updateBrand;
const deleteBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            yield Brands_1.default.destroy({ truncate: true });
        }
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.deleteBrands = deleteBrands;
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
        return access;
    }
    else {
        return false;
    }
};
