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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../db/connection"));
const Brands_1 = __importDefault(require("../routes/Brands"));
const CartProduct_1 = __importDefault(require("../routes/CartProduct"));
const Categories_1 = __importDefault(require("../routes/Categories"));
const Cookies_1 = __importDefault(require("../routes/Cookies"));
const Coupon_1 = __importDefault(require("../routes/Coupon"));
const Email_1 = __importDefault(require("../routes/Email"));
const Features_1 = __importDefault(require("../routes/Features"));
const Options_1 = __importDefault(require("../routes/Options"));
const Order_1 = __importDefault(require("../routes/Order"));
const OrderXproducts_1 = __importDefault(require("../routes/OrderXproducts"));
const PriceXproducts_1 = __importDefault(require("../routes/PriceXproducts"));
const Products_1 = __importDefault(require("../routes/Products"));
const Userdata_1 = __importDefault(require("../routes/Userdata"));
const Users_1 = __importDefault(require("../routes/Users"));
const UserXcoupons_1 = __importDefault(require("../routes/UserXcoupons"));
const Voucher_1 = __importDefault(require("../routes/Voucher"));
const webhook_1 = __importDefault(require("../webhook"));
const config_1 = require("./config");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.PORT || "3001";
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
        this.app.get("/", (req, res) => {
            res.json({ msg: "api Working" });
        });
        this.app.use("/api/Products", Products_1.default);
        this.app.use("/api/Features", Features_1.default);
        this.app.use("/api/Categories", Categories_1.default);
        this.app.use("/api/Users", Users_1.default);
        this.app.use("/api/Orders", Order_1.default);
        this.app.use("/api/OrdersXproducts", OrderXproducts_1.default);
        this.app.use("/api/userdata", Userdata_1.default);
        this.app.use("/api/Voucher", Voucher_1.default);
        this.app.use("/api/tablePrice", PriceXproducts_1.default);
        this.app.use("/api/brands", Brands_1.default);
        this.app.use("/api/options", Options_1.default);
        this.app.use("/api/cart", CartProduct_1.default);
        this.app.use("/api/email", Email_1.default);
        this.app.use("/api/coupon", Coupon_1.default);
        this.app.use("/api/userXcoupon", UserXcoupons_1.default);
        this.app.use("/api/cookies", Cookies_1.default);
        this.app.use("/webhook", webhook_1.default);
        this.app.get("/api/status", (req, res) => {
            res.json(config_1.MAINTENANCE);
        });
    }
    middlewares() {
        const allowedOrigins = [
            "http://localhost:4200",
            "https://www.somostresbe.com",
            "https://api.somostresbe.com",
            "https://www.tresbedistribuidora.com",
            "https://api.tresbedistribuidora.com",
            "https://tresbedistribuidora.com",
        ];
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, cors_1.default)({
            origin: allowedOrigins,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
        }));
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_1.MAINTENANCE) {
                try {
                    yield connection_1.default.authenticate();
                    console.log("DATABASE CONNECTED: " + config_1.DB_NAME);
                }
                catch (err) {
                    console.log("You have an error");
                    console.log(err);
                }
            }
        });
    }
}
exports.default = Server;
