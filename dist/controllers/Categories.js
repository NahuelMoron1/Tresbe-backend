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
exports.deleteCategories = exports.updateCategory = exports.postCategory = exports.deleteCategory = exports.getCategory = exports.getCategories = void 0;
const Categories_1 = __importDefault(require("../models/mysql/Categories"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listFeatures = yield Categories_1.default.findAll();
    res.json(listFeatures);
});
exports.getCategories = getCategories;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const CategoryAux = yield Categories_1.default.findByPk(id);
    if (CategoryAux) {
        res.json(CategoryAux);
    }
    else {
        res.status(404).json({ message: 'Error, Category not found' });
    }
});
exports.getCategory = getCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        const { id } = req.params;
        const CategoryAux = yield Categories_1.default.findByPk(`${id}`);
        if (CategoryAux) {
            yield Categories_1.default.destroy();
            res.json({ message: 'Category successfully deleted' });
        }
        else {
            res.status(404).json({ message: 'Error, Category not found' });
        }
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.deleteCategory = deleteCategory;
const postCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        const body = req.body;
        yield Categories_1.default.create(body);
        res.json({
            message: 'Category successfully created',
        });
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.postCategory = postCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const CategoryAux = yield Categories_1.default.findByPk(id);
    if (CategoryAux) {
        CategoryAux.update(body);
        res.json({
            message: 'Categories updated',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Category not found' });
    }
});
exports.updateCategory = updateCategory;
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        yield Categories_1.default.destroy({ truncate: true });
    }
    else {
        res.send('Permiso denegado');
    }
});
exports.deleteCategories = deleteCategories;
