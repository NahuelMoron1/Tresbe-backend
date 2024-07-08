import { Request, Response } from "express";
import { OrderXproducts } from "../models/mysql/orderXproducts";

export const getOrdersXproducts = async (req: Request, res: Response) => {    
    const listOrders = await OrderXproducts.findAll();
    res.json(listOrders);
}

export const getOrderXproducts = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OrderAux = await OrderXproducts.findByPk(id);    
    if(OrderAux){
        res.json(OrderAux);
    } else {
        res.status(404).json({message: 'Error, OrderXproducts not found'})
    }
}
export const getOxpByOrders = async (req: Request, res: Response) => {
    const { orderid } = req.params;
    
    const ordersAux = await OrderXproducts.findAll({where: {orderId: orderid}});  
    console.log(ordersAux.length);
    
      
    if(ordersAux){
        res.json(ordersAux);
    } else {
        res.status(404).json({message: 'Error, orders not found'})
    }
}
export const deleteOrderXproducts = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OrderAux = await OrderXproducts.findByPk(`${id}`);
    if(OrderAux){
        await OrderAux.destroy();
        res.json({message: 'OrderXproducts successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Order not found'})
    }
}
export const postOrderXproducts = async(req: Request, res: Response) => {
    const body = req.body;
    await OrderXproducts.create(body);
    res.json({
        message: 'OrderXproducts successfully created',
    })
}
export const updateOrderXproducts = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = await OrderXproducts.findByPk(id);
    if(OrderAux){
        OrderAux.update(body);
        res.json({
            message: 'OrderXproducts updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, OrderXproducts not found'})
    }
}
export const deleteOrdersXproducts = async (req: Request, res: Response) => {
    await OrderXproducts.destroy({truncate: true});
}