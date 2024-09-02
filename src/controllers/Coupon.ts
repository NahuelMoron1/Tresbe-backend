import { Request, Response } from "express";
import Coupon from "../models/mysql/Coupon";
import { Op } from "sequelize";

export const getCoupons = async (req: Request, res: Response) => {    
    const listCoupons = await Coupon.findAll();
    res.json(listCoupons);
}

export const getCoupon = async (req: Request, res: Response) => {
    const { id } = req.params;
    const CouponAux = await Coupon.findByPk(id);    
    if(CouponAux){
        res.json(CouponAux);
    } else {
        res.status(404).json({message: 'Error, Coupon not found'})
    }
}

export const searchCouponByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    const CouponAux = await Coupon.findOne({where: {code: name}});    
    if(CouponAux){
        res.json(CouponAux);
    } else {
        res.status(404).json({message: 'Error, Coupon not found'})
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    const { id } = req.params;
    const CouponAux = await Coupon.findByPk(`${id}`);
    if(CouponAux){
        await CouponAux.destroy();
        res.json({message: 'Coupon successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Coupon not found'})
    }
}
export const postCoupon = async(req: Request, res: Response) => {
    const body = req.body;
    await Coupon.create(body);
    res.json({
        message: 'Coupon successfully created',
    })
}
export const updateCoupon = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const CouponAux = await Coupon.findByPk(id);
    if(CouponAux){
        CouponAux.update(body);
        res.json({
            message: 'Coupon updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, Coupon not found'})
    }
}
export const deleteCoupons = async (req: Request, res: Response) => {
    await Coupon.destroy({truncate: true});
}