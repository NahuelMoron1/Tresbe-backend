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
exports.deleteUsersdata = exports.updateUserdata = exports.postUserdata = exports.deleteUserdata = exports.getUserdataByUserID = exports.getUserdata = exports.getUsersdata = void 0;
const Userdata_1 = __importDefault(require("../models/mysql/Userdata"));
const getUsersdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUsersdata = yield Userdata_1.default.findAll();
    res.json(listUsersdata);
});
exports.getUsersdata = getUsersdata;
const getUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const UserdataAux = yield Userdata_1.default.findByPk(id);
    if (UserdataAux) {
        res.json(UserdataAux);
    }
    else {
        res.status(404).json({ message: 'Error, Userdata not found' });
    }
});
exports.getUserdata = getUserdata;
const getUserdataByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.params;
    console.log("USER ID: " + userid);
    const UserAux = yield Userdata_1.default.findOne({ where: { userID: userid } });
    if (UserAux) {
        res.json(UserAux);
    }
    else {
        res.status(404).json({ message: 'Error, Userdata not found' });
    }
});
exports.getUserdataByUserID = getUserdataByUserID;
const deleteUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const UserdataAux = yield Userdata_1.default.findByPk(`${id}`);
    if (UserdataAux) {
        yield UserdataAux.destroy();
        res.json({ message: 'Userdata successfully deleted' });
    }
    else {
        res.status(404).json({ message: 'Error, Userdata not found' });
    }
});
exports.deleteUserdata = deleteUserdata;
const postUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    yield Userdata_1.default.create(body);
    res.json({
        message: 'Userdata successfully created',
    });
});
exports.postUserdata = postUserdata;
const updateUserdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    const UserdataAux = yield Userdata_1.default.findByPk(id);
    if (UserdataAux) {
        UserdataAux.update(body);
        res.json({
            message: 'Userdata updated with success',
        });
    }
    else {
        res.status(404).json({ message: 'Error, Userdata not found' });
    }
});
exports.updateUserdata = updateUserdata;
const deleteUsersdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Userdata_1.default.destroy({ truncate: true });
});
exports.deleteUsersdata = deleteUsersdata;
