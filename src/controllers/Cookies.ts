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
            return res.json(true); // Usamos return para evitar que siga ejecutando código
        } else {
            return res.json(false); // Usamos return para evitar que siga ejecutando código
        }
    } else {
        if (cookieName == 'admin_token') {
            if (!token) {
                return res.json(false); // Usamos return para evitar que siga ejecutando código
            } else {
                if (typeof token === 'object' && token !== null) {
                    const userAux: PublicUser = token as PublicUser;
                    if (userAux.email == admin) {
                        return res.json(true); // Usamos return para evitar que siga ejecutando código
                    } else {
                        return res.json(false);
                    }
                } else {
                    res.json(false);
                }
            }
        }

        try {
            const data = jwt.verify(refreshToken, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User                
                const access_token = jwt.sign(
                    { id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client },
                    SECRET_JWT_KEY,
                    { expiresIn: "1h" }
                );

                res.cookie('access_token', access_token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                    ///domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60
                });

                const adminToken = req.cookies.admin_token;
                if (adminToken) {
                    const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
                    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
                        const userAux: PublicUser = dataAdmin as PublicUser;
                        if (userAux.email == admin && user.email == admin) {
                            const admin_token = jwt.sign(
                                { id: user.id, email: user.email, priceList: user.priceList, username: user.username, client: user.client },
                                SECRET_JWT_KEY,
                                { expiresIn: "1h" }
                            );
                            res.cookie('admin_token', admin_token, {
                                path: '/',
                                httpOnly: true,
                                secure: true,
                                domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                                ///domain: '.tresbedistribuidora.com',
                                sameSite: 'none',
                                maxAge: 1000 * 60 * 60
                            });
                        }
                    }
                }

                return res.json(true); // Usamos return para evitar que siga ejecutando código
            } else {
                return res.status(401).send("Acceso denegado"); // Enviamos respuesta y detenemos la ejecución
            }
        } catch (error) {
            return res.status(401).send("acceso denegado"); // Enviamos respuesta en caso de error y detenemos la ejecución
        }
    }
};

export const getToken = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];

    if (!token) {
        return res.json(false); // Usamos return para detener la ejecución
    } else {
        try {
            const data = jwt.verify(token, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                return res.json(user); // Enviamos la respuesta y terminamos la ejecución
            } else {
                return res.status(401).send("Acceso denegado"); // Enviamos respuesta de error y detenemos la ejecución
            }
        } catch (error) {
            return res.status(401).send("acceso denegado"); // Enviamos respuesta de error en caso de excepción
        }
    }
};
