import { Request, Response } from "express";
import { OrderXproducts } from "../models/mysql/orderXproducts";
import { PublicUser } from "../models/PublicUser";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";

export const getOrdersXproducts = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const listOrders = await OrderXproducts.findAll();
            res.json(listOrders);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

const verifyAdmin = (adminToken: any) => {
    const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
        const userAux: PublicUser = dataAdmin as PublicUser;
        let access = false;
        let i = 0;
        while(i<admin.length && !access){
            if(userAux.email === admin[i]){
                access = true;
            } else {
                i++;
            }
        }
        if (access) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const getOrderXproducts = async (req: Request, res: Response) => {
    const { id } = req.params;
    let access = req.cookies.access_token
    if (access) {
        try {
            const data = jwt.verify(access, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                if (user.id == id || verifyAdmin(access)) {
                    const OrderAux = await OrderXproducts.findByPk(id);
                    if (OrderAux) {
                        res.json(OrderAux);
                    } else {
                        res.status(404).json({ message: 'Error, OrderXproducts not found' })
                    }
                } else {
                    res.send('Ruta protegida');
                }
            } else {
                res.send('Ruta protegida');
            }
        } catch (error) {
            res.send('Ruta protegida');
        }
    }
}
export const getOxpByOrders = async (req: Request, res: Response) => {
    const { orderid } = req.params;

    const ordersAux = await OrderXproducts.findAll({ where: { orderId: orderid } });

    if (ordersAux) {
        res.json(ordersAux);
    } else {
        res.status(404).json({ message: 'Error, orders not found' })
    }
}
export const deleteOrderXproducts = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const OrderAux = await OrderXproducts.findByPk(`${id}`);
            if (OrderAux) {
                await OrderAux.destroy();
                res.json({ message: 'OrderXproducts successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Order not found' })
            }
        }
    }
}
export const deleteOrderXproductsByIDs = async (req: Request, res: Response) => {

    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { productID } = req.params;
            const { orderID } = req.params;
            const OrderAux = await OrderXproducts.findOne({
                where: {
                    productId: productID,
                    orderId: orderID
                }
            });
            if (OrderAux) {
                await OrderAux.destroy();
                res.json({ message: 'OrderXproducts successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Order not found' })
            }
        }
    }
}
export const postOrderXproducts = async (req: Request, res: Response) => {
    let access = req.cookies.access_token
    const body = req.body;
    if (access) {
        await OrderXproducts.create(body);
        res.json({
            message: 'OrderXproducts successfully created',
        })
    }
}
export const updateOrderXproducts = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = await OrderXproducts.findByPk(id);
    if (OrderAux) {
        OrderAux.update(body);
        res.json({
            message: 'OrderXproducts updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, OrderXproducts not found' })
    }
}
export const deleteOrdersXproducts = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            await OrderXproducts.destroy({ truncate: true });
        }
    }
}