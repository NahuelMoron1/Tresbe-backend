import { Request, Response } from "express";
import CartProduct from "../models/mysql/CartProduct";

export const getCartProducts = async (req: Request, res: Response) => {    
    const listProducts = await CartProduct.findAll();
    res.json(listProducts);
}

export const getCartProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await CartProduct.findByPk(id);    
    if(productAux){
        res.json(productAux);
    } else {
        res.status(404).json({message: 'Error, CartProduct not found'})
    }
}
export const getCartProductsByOrder = async (req: Request, res: Response) => {
    const { orderID } = req.params;
    
    const productsAux = await CartProduct.findAll({where: {orderID: orderID}});
    if(productsAux){
        res.json(productsAux);
    } else {
        res.status(404).json({message: 'Error, CartProduct not found'})
    }
}

export const deleteCartProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await CartProduct.findByPk(`${id}`);
    if(productAux){
        await productAux.destroy();
        res.json({message: 'CartProduct successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Cartproduct not found'})
    }
}
export const postCartProduct = async(req: Request, res: Response) => {
    const body = req.body;
    await CartProduct.create(body);
    res.json({
        message: 'CartProduct successfully created',
    })
}
export const updateCartProduct = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await CartProduct.findByPk(id);
    if(productAux){
        productAux.update(body);
        res.json({
            message: 'CartProduct updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, Cartproduct not found'})
    }
}
export const deleteCartProducts = async (req: Request, res: Response) => {
    await CartProduct.destroy({truncate: true});
}