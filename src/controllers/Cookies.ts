import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const tokenExist = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if(!token){
        res.json(false);
    }else{        
        res.json(true);
    }
}

export const getToken = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if(!token){
        return false;
    }else{
        try{
            const data = jwt.verify(token, SECRET_JWT_KEY);
            if (typeof data === 'object' && data !== null) {
                const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
                return res.json(user);
            }else{
                return res.status(401).send("Acceso denegado");
            }
        }catch(error){
            return res.status(401).send("acceso denegado");
        }
    }
}

