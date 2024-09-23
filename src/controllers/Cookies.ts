import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";

export const tokenExist = (req: Request, res: Response) => {
    const { cookieName } = req.params;
    const token = req.cookies[cookieName];
    if(!token){
        return false;
    }else{
        return true;
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
            res.json(data);
        }catch(error){
            return res.status(401).send("acceso denegado");
        }
        return true;
    }
}

