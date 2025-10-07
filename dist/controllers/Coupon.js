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
exports.deleteCoupons = exports.updateCoupon = exports.postCoupon = exports.deleteCoupon = exports.searchCouponByName = exports.getCoupon = exports.getCoupons = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../models/config");
const Coupon_1 = __importDefault(require("../models/mysql/Coupon"));
const getCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const listCoupons = yield Coupon_1.default.findAll();
        if (!listCoupons) {
            return res.status(404).json({ message: "No se encontraron cupones" });
        }
        return res.status(200).json(listCoupons);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCoupons = getCoupons;
const getCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const CouponAux = yield Coupon_1.default.findByPk(id);
        if (!CouponAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el cupon buscado" });
        }
        return res.status(200).json(CouponAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.getCoupon = getCoupon;
const searchCouponByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        if (!name || typeof name !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const CouponAux = yield Coupon_1.default.findOne({ where: { code: name } });
        if (!CouponAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el cupon buscado" });
        }
        return res.status(200).json(CouponAux);
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.searchCouponByName = searchCouponByName;
const deleteCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const CouponAux = yield Coupon_1.default.findByPk(`${id}`);
        if (!CouponAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el cupon buscado para eliminar" });
        }
        yield CouponAux.destroy();
        return res.status(200).json({ message: "Cupon eliminado con exito" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.deleteCoupon = deleteCoupon;
const postCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Coupon_1.default.create(body);
        return res.status(200).json({
            message: "Cupon creado con exito",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.postCoupon = postCoupon;
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Formato de datos mal enviado, revisa bien lo que enviaste",
            });
        }
        const CouponAux = yield Coupon_1.default.findByPk(id);
        if (!CouponAux) {
            return res
                .status(404)
                .json({ message: "No se encontró el cupon buscado para actualizar" });
        }
        yield CouponAux.update(body);
        return res.status(200).json({
            message: "Coupon updated with success",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Hubo un error, ponete en contacto con sistemas: ",
            error,
        });
    }
});
exports.updateCoupon = updateCoupon;
const deleteCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Coupon_1.default.destroy({ truncate: true });
        return res.status(200).json("Todos los cupones fueron eliminados");
    }
    catch (error) { }
});
exports.deleteCoupons = deleteCoupons;
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
