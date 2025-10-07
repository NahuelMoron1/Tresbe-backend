import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import db from "../db/connection";
import brandRouter from "../routes/Brands";
import cartRouter from "../routes/CartProduct";
import categoriesRouter from "../routes/Categories";
import cookieRouter from "../routes/Cookies";
import couponRouter from "../routes/Coupon";
import emailRouter from "../routes/Email";
import featuresRouter from "../routes/Features";
import optionsRouter from "../routes/Options";
import ordersRouter from "../routes/Order";
import ordersXproductsRouter from "../routes/OrderXproducts";
import tablePriceRouter from "../routes/PriceXproducts";
import productRouter from "../routes/Products";
import userdataRouter from "../routes/Userdata";
import usersRouter from "../routes/Users";
import userXcouponRouter from "../routes/UserXcoupons";
import voucherRouter from "../routes/Voucher";
import webhookRouter from "../webhook";

import { DB_NAME, MAINTENANCE, PORT } from "./config";

class Server {
  private app: Application;
  private port: string;
  constructor() {
    this.app = express();
    this.port = PORT || "3001";
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
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ msg: "api Working" });
    });
    this.app.use("/api/Products", productRouter);
    this.app.use("/api/Features", featuresRouter);
    this.app.use("/api/Categories", categoriesRouter);
    this.app.use("/api/Users", usersRouter);
    this.app.use("/api/Orders", ordersRouter);
    this.app.use("/api/OrdersXproducts", ordersXproductsRouter);
    this.app.use("/api/userdata", userdataRouter);
    this.app.use("/api/Voucher", voucherRouter);
    this.app.use("/api/tablePrice", tablePriceRouter);
    this.app.use("/api/brands", brandRouter);
    this.app.use("/api/options", optionsRouter);
    this.app.use("/api/cart", cartRouter);
    this.app.use("/api/email", emailRouter);
    this.app.use("/api/coupon", couponRouter);
    this.app.use("/api/userXcoupon", userXcouponRouter);
    this.app.use("/api/cookies", cookieRouter);
    this.app.use("/webhook", webhookRouter);
    this.app.get("/api/status", (req, res) => {
      res.json(MAINTENANCE);
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
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );
  }
  async dbConnect() {
    if (!MAINTENANCE) {
      try {
        await db.authenticate();
        console.log("DATABASE CONNECTED: " + DB_NAME);
      } catch (err) {
        console.log("You have an error");
        console.log(err);
      }
    }
  }
}
export default Server;
