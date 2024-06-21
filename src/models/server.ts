import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import productRouter from '../routes/Products';
import featuresRouter from '../routes/Features';
import categoriesRouter from '../routes/Categories';
import usersRouter from '../routes/Users';
import ordersRouter from '../routes/Order';
import ordersXproductsRouter from '../routes/OrderXproducts';
import userdataRouter from '../routes/Userdata';
import db from '../db/connection';
class Server {
    private app: Application;
    private port: string;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares()
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`server listening on port ${process.env.PORT}`);
        })
    }
    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ msg: 'api Working' });
        })
        this.app.use('/api/Products', productRouter);
        this.app.use('/api/Features', featuresRouter);
        this.app.use('/api/Categories', categoriesRouter);
        this.app.use('/api/Users', usersRouter);
        this.app.use('/api/Orders', ordersRouter);
        this.app.use('/api/OrdersXproducts', ordersXproductsRouter);
        this.app.use('/api/userdata', userdataRouter);

    }
    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }
    async dbConnect() {
        try{
            await db.authenticate();
        console.log("DATABASE CONNECTED");
        }catch(err){
            console.log("You have an error");
        }
    }
}
export default Server;