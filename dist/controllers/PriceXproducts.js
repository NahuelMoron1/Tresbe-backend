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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const PriceXproducts_1 = __importDefault(require("../models/mysql/PriceXproducts"));
const getPriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const listProducts = yield PriceXproducts_1.default.findAll();
        if (!listProducts) {
            return res
                .status(404)
                .json({ message: "No se encontraron precios por producto" });
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
exports.getPriceXproducts = getPriceXproducts;
const getPriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield PriceXproducts_1.default.findByPk(id);
        if (!productAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el precio por producto buscado" });
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
exports.getPriceXproduct = getPriceXproduct;
const getTableByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { optionID } = req.params;
        if (!optionID || typeof optionID !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const tableAux = yield PriceXproducts_1.default.findOne({
            where: { optionID: optionID },
        });
        if (!tableAux) {
            return res
                .status(404)
                .json({ message: "No se encontró la tabla buscada por producto" });
        }
        return res.status(200).json(tableAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getTableByProduct = getTableByProduct;
const deletePriceXproductByOptionID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productAux = yield PriceXproducts_1.default.findOne({
            where: { optionID: id },
        });
        if (productAux) {
            yield productAux.destroy();
            return "DELETED";
        }
        else {
            return "Error";
        }
    }
    catch (error) {
        return "Error";
    }
});
exports.deletePriceXproductByOptionID = deletePriceXproductByOptionID;
const deletePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
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
        const productAux = yield PriceXproducts_1.default.findByPk(`${id}`);
        if (!productAux) {
            return res.status(404).json({
                message: "No se encontró el precio por producto buscado para eliminar",
            });
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
exports.deletePriceXproduct = deletePriceXproduct;
const postPriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        const body = req.body;
        if (!validatePriceXproducts(body)) {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa los datos que enviaste",
            });
        }
        yield PriceXproducts_1.default.create(body);
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
exports.postPriceXproduct = postPriceXproduct;
function validatePriceXproducts(body) {
    if (!body.optionID ||
        typeof body.optionID !== "string" ||
        !body.priceList1 ||
        typeof body.priceList1 !== "number" ||
        !body.priceList2 ||
        typeof body.priceList2 !== "number" ||
        !body.priceList3 ||
        typeof body.priceList3 !== "number" ||
        !body.priceList4 ||
        typeof body.priceList4 !== "number" ||
        !body.priceListE ||
        typeof body.priceListE !== "number" ||
        !body.priceListG ||
        typeof body.priceListG !== "number" ||
        !body.costPrice ||
        typeof body.costPrice !== "number") {
        return false;
    }
    return true;
}
const updatePriceXproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield PriceXproducts_1.default.findByPk(id);
        if (!productAux) {
            return res.status(404).json({
                message: "No se encontró el precio por producto buscado para actualizar",
            });
        }
        yield productAux.update(body);
        return res.status(200).json({
            message: "Producto modificado con exito",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updatePriceXproduct = updatePriceXproduct;
const updateOptionID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const productAux = yield PriceXproducts_1.default.findOne({
            where: { optionID: id },
        });
        if (typeof productAux !== "object" || productAux === null) {
            return res.status(404).json({
                message: "No se encontró el precio por producto buscado para actualizar",
            });
        }
        const pricesAux = productAux;
        pricesAux.optionID = body.optionID;
        yield PriceXproducts_1.default.update({ optionID: pricesAux.optionID }, { where: { id: pricesAux.id } });
        return res.status(200).json({
            message: "OPTION ID updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateOptionID = updateOptionID;
const deletePriceXproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const admin_token = req.cookies.admin_token;
        if (!access_token || !admin_token) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        if (!verifyAdmin(admin_token)) {
            return res
                .status(401)
                .json({ message: "No tenes permiso para realizar esta acción" });
        }
        yield PriceXproducts_1.default.destroy({ truncate: true });
        return res
            .status(200)
            .json({ message: "Precios por productos eliminados en su totalidad" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deletePriceXproducts = deletePriceXproducts;
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
