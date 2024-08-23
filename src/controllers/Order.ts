import { Request, Response } from "express";
import Order from "../models/mysql/Orders";
import nodemailer from 'nodemailer';
import { Op } from "sequelize";


export const getOrders = async (req: Request, res: Response) => {    
    const listOrders = await Order.findAll();
    res.json(listOrders);
}

export const getOrdersByUser = async (req: Request, res: Response) => {
    const { userid } = req.params;
    
    const ordersAux = await Order.findAll({where: {userID: userid}});
    if(ordersAux){
        res.json(ordersAux);
    } else {
        res.status(404).json({message: 'Error, orders not found'})
    }
}

export const getOrdersNotPayed = async (req: Request, res: Response) => {    
    const { userid } = req.params;
    const ordersAux = await Order.findAll({where: {userId: userid} && {payed: false}});
    if(ordersAux){
        res.json(ordersAux);
    } else {
        res.status(404).json({message: 'Error, orders not found'})
    }
}

export const getOrdersAdmin = async (req: Request, res: Response) => {    
    const ordersAux = await Order.findAll({where: {attended: 0}});
    if(ordersAux){
        res.json(ordersAux);
    } else {
        res.status(404).json({message: 'Error, orders not found'})
    }
}

export const searchOrders = async (req: Request, res: Response) => {    
    const { idcode } = req.params;
    const { userid } = req.params;
    const searchWords = idcode.split(' ').map(word => word.toLowerCase());
    const whereConditions: any = {
        [Op.and]: searchWords.map(word => ({
            code: { [Op.like]: `%${word}%` }
        }))
    };
    if(userid != undefined && userid != null && userid != ''){
        whereConditions[Op.and].push({ userID: userid });
    }
    const ordersAux = await Order.findAll({where: whereConditions});
    
    if(ordersAux){
        res.json(ordersAux);
    } else {
        res.status(404).json({message: 'Error, orders not found'})
    }
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
export const sendEmail = async (to: string, subject: string, text: string) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Puedes usar otro servicio como 'Yahoo', 'Outlook', etc.
        auth: {
            user: 'info.tresbedistribuidora@gmail.com',
            pass: 'tyfd wyjm qnle fgvt'
        }
    });

    let mailOptions = {
        from: 'info.tresbedistribuidora@gmail.com', // Remitente
        to: to, // Destinatario
        subject: subject, // Asunto
        html: text, // Cuerpo del correo en texto plano
        ///html: html // Cuerpo del correo en formato HTML (opcional)
    };
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
}
export const postOrder = async(req: Request, res: Response) => {
    const { order, to, subject, html, htmlAux } = req.body;

    await Order.create(order);

    await sendEmail(to, subject, html);
    let toAux = 'info.tresbedistribuidora@gmail.com'
    await sendEmail(toAux, subject, htmlAux);

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