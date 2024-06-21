import { Request, Response } from "express";
import Order from "../models/mysql/Orders";

export const getOrders = async (req: Request, res: Response) => {    
    const listOrders = await Order.findAll();
    res.json(listOrders);
}

export const getOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OrderAux = await Order.findByPk(id);    
    if(OrderAux){
        res.json(OrderAux);
    } else {
        res.status(404).json({message: 'Error, Order not found'})
    }
}
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OrderAux = await Order.findByPk(`${id}`);
    if(OrderAux){
        await OrderAux.destroy();
        res.json({message: 'Order successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Order not found'})
    }
}
export const postOrder = async(req: Request, res: Response) => {
    const body = req.body;
    await Order.create(body);
    res.json({
        message: 'Order successfully created',
    })
}
export const updateOrder = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = await Order.findByPk(id);
    if(OrderAux){
        OrderAux.update(body);
        res.json({
            message: 'Order updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, Order not found'})
    }
}
export const deleteOrders = async (req: Request, res: Response) => {
    await Order.destroy({truncate: true});
}