import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const tokenExist = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        if (token) {
            res.json(true);
        } else {
            res.json(false);
        }
    } else {
        if(cookieName == 'admin_token'){
            if(!token){
                res.json(false);
            }else{
                res.json(true);
            }
        }
        try {
            const data = jwt.verify(refreshToken, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User                
                const access_token = jwt.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, SECRET_JWT_KEY, {
                    expiresIn: "1h"
                });

                res.cookie('access_token', access_token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,///process.env.NODE_ENV == 'production',
                    sameSite: 'none',
                    domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                    maxAge: 1000 * 60 * 60
                });

                const adminToken = req.cookies.admin_token;
                if (adminToken || user.email == admin) {
                    const admin_token = jwt.sign({ id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client }, SECRET_JWT_KEY, {
                        expiresIn: "1h"
                    });

                    res.cookie('admin_token', admin_token, {
                        path: '/',
                        httpOnly: true,
                        secure: true,///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                        sameSite: 'none',
                        maxAge: 1000 * 60 * 60
                    });
                }
            } else {
                return res.status(401).send("Acceso denegado");
            }
        } catch (error) {
            return res.status(401).send("acceso denegado");
        }
        res.json(true);
    }
}

export const getToken = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if (!token) {
        return false;
    } else {
        try {
            const data = jwt.verify(token, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                return res.json(user);
            } else {
                return res.status(401).send("Acceso denegado");
            }
        } catch (error) {
            return res.status(401).send("acceso denegado");
        }
    }
}