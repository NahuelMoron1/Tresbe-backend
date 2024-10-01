import { Request, Response } from "express";
import Order from "../models/mysql/Orders";
import nodemailer from 'nodemailer';
import { Op } from "sequelize"; import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";


export const getOrders = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const listOrders = await Order.findAll();
        res.json(listOrders);
    } else {
        res.send('No se puede acceder a las ordenes de compra de la empresa');
    }
}

export const getOrdersByUser = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { userid } = req.params;
        if (admin_token) {
            const ordersAux = await Order.findAll({ where: { userID: userid } });
            if (ordersAux) {
                res.json(ordersAux);
            } else {
                res.status(404).json({ message: 'Error, orders not found' })
            }
        } else {
            const data = jwt.verify(access_token, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                if (user.id == userid) {
                    const ordersAux = await Order.findAll({ where: { userID: userid } });
                    if (ordersAux) {
                        res.json(ordersAux);
                    } else {
                        res.status(404).json({ message: 'Error, orders not found' })
                    }
                }else{
                    res.send('No podes acceder a ordenes de compra de otros usuarios');
                }
            }
        }
    }else{
        res.send('No podes acceder a las ordenes de compra si no estas logueado')
    }
}

export const getOrdersNotPayed = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const { userid } = req.params;
        const ordersAux = await Order.findAll({ where: { userId: userid } && { payed: false } });
        if (ordersAux) {
            res.json(ordersAux);
        } else {
            res.status(404).json({ message: 'Error, orders not found' })
        }
    }
}

export const getOrdersAdmin = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const ordersAux = await Order.findAll({ where: { attended: 0 } });
        if (ordersAux) {
            res.json(ordersAux);
        } else {
            res.status(404).json({ message: 'Error, orders not found' })
        }
    }
}

export const searchOrders = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { idcode } = req.params;
        const { userid } = req.params;
        let access = false;
        if (admin_token) {
            access = true;
        } else {
            const data = jwt.verify(access_token, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                if (user.id == userid) {
                    access = true;
                }
            }
        }
        if (access) {
            const searchWords = idcode.split(' ').map(word => word.toLowerCase());
            const whereConditions: any = {
                [Op.and]: searchWords.map(word => ({
                    code: { [Op.like]: `%${word}%` }
                }))
            };
            if (userid != undefined && userid != null && userid != '') {
                whereConditions[Op.and].push({ userID: userid });
            }
            const ordersAux = await Order.findAll({ where: whereConditions });

            if (ordersAux) {
                res.json(ordersAux);
            } else {
                res.status(404).json({ message: 'Error, orders not found' })
            }
        } else {
            res.send('No se puede acceder a los pedidos de otros usuarios');
        }
    }
}

export const getOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OrderAux = await Order.findByPk(id);
    if (OrderAux) {
        res.json(OrderAux);
    } else {
        res.status(404).json({ message: 'Error, Order not found' })
    }
}
export const deleteOrder = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const { id } = req.params;
        const OrderAux = await Order.findByPk(`${id}`);
        if (OrderAux) {
            await OrderAux.destroy();
            res.json({ message: 'Order successfully deleted' });
        } else {
            res.status(404).json({ message: 'Error, Order not found' })
        }
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
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
}
export const postOrder = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    if (access_token) {
        const { order, to, subject, html, htmlAux } = req.body;

        await Order.create(order);

        await sendEmail(to, subject, html);
        let toAux = 'info.tresbedistribuidora@gmail.com'
        await sendEmail(toAux, subject, htmlAux);

        res.json({
            message: 'Order successfully created',
        })
    } else {
        res.send('No podes comprar sin haber iniciado sesion');
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const OrderAux = await Order.findByPk(id);
    if (OrderAux) {
        OrderAux.update(body);
        res.json({
            message: 'Order updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, Order not found' })
    }
}
export const deleteOrders = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        await Order.destroy({ truncate: true });
    } else {
        res.send('Acceso denegado');
    }
}