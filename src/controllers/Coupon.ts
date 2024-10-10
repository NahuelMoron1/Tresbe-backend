import { Request, Response } from "express";
import Coupon from "../models/mysql/Coupon";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getCoupons = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const listCoupons = await Coupon.findAll();
            res.json(listCoupons);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getCoupon = async (req: Request, res: Response) => {
    const { id } = req.params;
    const CouponAux = await Coupon.findByPk(id);
    if (CouponAux) {
        res.json(CouponAux);
    } else {
        res.status(404).json({ message: 'Error, Coupon not found' })
    }
}

export const searchCouponByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    const CouponAux = await Coupon.findOne({ where: { code: name } });
    if (CouponAux) {
        res.json(CouponAux);
    } else {
        res.status(404).json({ message: 'Error, Coupon not found' })
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const CouponAux = await Coupon.findByPk(`${id}`);
            if (CouponAux) {
                await CouponAux.destroy();
                res.json({ message: 'Coupon successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Coupon not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postCoupon = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            await Coupon.create(body);
            res.json({
                message: 'Coupon successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updateCoupon = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const CouponAux = await Coupon.findByPk(id);
    if (CouponAux) {
        CouponAux.update(body);
        res.json({
            message: 'Coupon updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, Coupon not found' })
    }
}
export const deleteCoupons = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await Coupon.destroy({ truncate: true });
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
        if (userAux.email == admin) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}