import { Request, Response } from "express";
import CartProduct from "../models/mysql/CartProduct";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getCartProducts = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const listProducts = await CartProduct.findAll();
            res.json(listProducts);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getCartProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await CartProduct.findByPk(id);
    if (productAux) {
        res.json(productAux);
    } else {
        res.status(404).json({ message: 'Error, CartProduct not found' })
    }
}
export const getCartProductsByOrder = async (req: Request, res: Response) => {
    const { orderID } = req.params;

    const productsAux = await CartProduct.findAll({ where: { orderID: orderID } });
    if (productsAux) {
        res.json(productsAux);
    } else {
        res.status(404).json({ message: 'Error, CartProduct not found' })
    }
}

export const deleteCartProduct = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const productAux = await CartProduct.findByPk(`${id}`);
            if (productAux) {
                await productAux.destroy();
                res.json({ message: 'CartProduct successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Cartproduct not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postCartProduct = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    if (access_token) {
        const body = req.body;
        await CartProduct.create(body);
        res.json({
            message: 'CartProduct successfully created',
        })
    }
}
export const updateCartProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await CartProduct.findByPk(id);
    if (productAux) {
        productAux.update(body);
        res.json({
            message: 'CartProduct updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, Cartproduct not found' })
    }
}
export const deleteCartProducts = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await CartProduct.destroy({ truncate: true });
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
        while (i < admin.length && !access) {
            if (userAux.email === admin[i]) {
                access = true;
            } else {
                i++;
            }
        }
        return access;
    } else {
        return false;
    }
}