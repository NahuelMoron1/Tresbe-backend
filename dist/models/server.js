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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
/*import multer from 'multer'
import sharp from 'sharp';*/
const Products_1 = __importDefault(require("../routes/Products"));
const Features_1 = __importDefault(require("../routes/Features"));
const Categories_1 = __importDefault(require("../routes/Categories"));
const Users_1 = __importDefault(require("../routes/Users"));
const Order_1 = __importDefault(require("../routes/Order"));
const OrderXproducts_1 = __importDefault(require("../routes/OrderXproducts"));
const Userdata_1 = __importDefault(require("../routes/Userdata"));
const Voucher_1 = __importDefault(require("../routes/Voucher"));
const connection_1 = __importDefault(require("../db/connection"));
const PriceXproducts_1 = __importDefault(require("../routes/PriceXproducts"));
const Brands_1 = __importDefault(require("../routes/Brands"));
const Options_1 = __importDefault(require("../routes/Options"));
const CartProduct_1 = __importDefault(require("../routes/CartProduct"));
const config_1 = require("./config");
class Server {
    /*private storage = multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, './uploads')
        }
    })*/
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`server listening on port ${this.port}`);
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({ msg: 'api Working' });
        });
        this.app.use('/api/Products', Products_1.default);
        this.app.use('/api/Features', Features_1.default);
        this.app.use('/api/Categories', Categories_1.default);
        this.app.use('/api/Users', Users_1.default);
        this.app.use('/api/Orders', Order_1.default);
        this.app.use('/api/OrdersXproducts', OrderXproducts_1.default);
        this.app.use('/api/userdata', Userdata_1.default);
        this.app.use('/api/Voucher', Voucher_1.default);
        this.app.use('/api/tablePrice', PriceXproducts_1.default);
        this.app.use('/api/brands', Brands_1.default);
        this.app.use('/api/options', Options_1.default);
        this.app.use('/api/cart', CartProduct_1.default);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log("DATABASE CONNECTED");
            }
            catch (err) {
                console.log("You have an error");
            }
        });
    }
}
exports.default = Server;
