import { Request, Response } from "express";
import nodemailer from 'nodemailer';

export const sendEmail = async (req: Request, res: Response) => {
    let { to } = req.body;
    let { subject } = req.body;
    let { text } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
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
        res.json(info);
    } catch (error) {
        res.status(404).json({message: 'Error on sending the mail'})
    }
}