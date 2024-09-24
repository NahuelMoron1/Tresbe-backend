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
exports.deleteOptions = exports.updateOption = exports.postOption = exports.deleteOption = exports.deleteOptionByProduct = exports.getProductOptionsByName = exports.getProductOptionsByTwo = exports.getProductOptions = exports.getOption = exports.getOptions = void 0;
const Options_1 = __importDefault(require("../models/mysql/Options"));
const getOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listOptions = yield Options_1.default.findAll();
    res.json(listOptions);
});
exports.getOptions = getOptions;
const getOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OptionAux = yield Options_1.default.findByPk(id);
    if (OptionAux) {
        res.json(OptionAux);
    }
    else {
        res.status(404).json({ message: 'Error, Option not found' });
    }
});
exports.getOption = getOption;
const getProductOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productID } = req.params;
    const OptionAux = yield Options_1.default.findAll({ where: { productID: productID } });
    if (OptionAux) {
        res.json(OptionAux);
    }
    else {
        res.status(404).json({ message: 'Error, Options not found' });
    }
});
exports.getProductOptions = getProductOptions;
const getProductOptionsByTwo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productID } = req.params;
    const { optionName } = req.params;
    const optionValid = decodeURIComponent(optionName);
    const OptionAux = yield Options_1.default.findOne({ where: { name: optionValid } && { productID: productID } });
    if (OptionAux) {
        res.json(OptionAux);
    }
    else {
        res.status(404).json({ message: 'Error, Options not found' });
    }
});
exports.getProductOptionsByTwo = getProductOptionsByTwo;
const getProductOptionsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const OptionAux = yield Options_1.default.findOne({ where: { name: name } });
    if (OptionAux) {
        res.json(OptionAux);
    }
    else {
        res.status(404).json({ message: 'Error, Options not found' });
    }
});
exports.getProductOptionsByName = getProductOptionsByName;
const deleteOptionByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OptionAux = yield Options_1.default.findAll({ where: { productID: id } });
    if (OptionAux) {
        if (OptionAux.length > 0) {
            if (OptionAux.length < 2) {
                yield OptionAux[0].destroy();
            }
            else {
                for (let i = 0; i < OptionAux.length; i++) {
                    yield OptionAux[i].destroy();
                }
            }
            res.json({ message: 'Options successfully deleted' });
        }
    }
    else {
        res.status(404).json({ message: 'Error, Options not found' });
    }
});
exports.deleteOptionByProduct = deleteOptionByProduct;
const deleteOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const OptionAux = yield Options_1.default.findByPk(`${id}`);
    if (OptionAux) {
        yield OptionAux.destroy();
        res.json({ message: 'Option successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Option not found' });
    }
});
exports.deleteOption = deleteOption;
const postOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield Options_1.default.create(body);
    res.json({
        message: 'Option successfully created',
    });
});
exports.postOption = postOption;
const updateOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const OptionAux = yield Options_1.default.findByPk(id);
    if (OptionAux) {
        OptionAux.update(body);
        res.json({
            message: 'Option updated',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Option not found' });
    }
});
exports.updateOption = updateOption;
const deleteOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Options_1.default.destroy({ truncate: true });
});
exports.deleteOptions = deleteOptions;
