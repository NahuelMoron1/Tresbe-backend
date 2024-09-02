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
const Coupon_1 = __importDefault(require("../models/mysql/Coupon"));
const getCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listCoupons = yield Coupon_1.default.findAll();
    res.json(listCoupons);
});
exports.getCoupons = getCoupons;
const getCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const CouponAux = yield Coupon_1.default.findByPk(id);
    if (CouponAux) {
        res.json(CouponAux);
    }
    else {
        res.status(404).json({ message: 'Error, Coupon not found' });
    }
});
exports.getCoupon = getCoupon;
const searchCouponByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const CouponAux = yield Coupon_1.default.findOne({ where: { code: name } });
    if (CouponAux) {
        res.json(CouponAux);
    }
    else {
        res.status(404).json({ message: 'Error, Coupon not found' });
    }
});
exports.searchCouponByName = searchCouponByName;
const deleteCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const CouponAux = yield Coupon_1.default.findByPk(`${id}`);
    if (CouponAux) {
        yield CouponAux.destroy();
        res.json({ message: 'Coupon successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Coupon not found' });
    }
});
exports.deleteCoupon = deleteCoupon;
const postCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield Coupon_1.default.create(body);
    res.json({
        message: 'Coupon successfully created',
    });
});
exports.postCoupon = postCoupon;
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const CouponAux = yield Coupon_1.default.findByPk(id);
    if (CouponAux) {
        CouponAux.update(body);
        res.json({
            message: 'Coupon updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Coupon not found' });
    }
});
exports.updateCoupon = updateCoupon;
const deleteCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Coupon_1.default.destroy({ truncate: true });
});
exports.deleteCoupons = deleteCoupons;
