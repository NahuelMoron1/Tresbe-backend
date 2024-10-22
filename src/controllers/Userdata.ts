import { Request, Response } from "express";
import Userdata from "../models/mysql/Userdata";
import { PublicUser } from "../models/PublicUser";
import { admin } from "../models/config";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";

export const getUsersdata = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const listUsersdata = await Userdata.findAll();
            res.json(listUsersdata);
        }
    }
}
const verifyAdmin = (adminToken: any) => {
    const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
        const userAux: PublicUser = dataAdmin as PublicUser;
        let access = false;
        let i = 0;
        while(i<admin.length && !access){
            if(userAux.email === admin[i]){
                access = true;
            } else {
                i++;
            }
        }
        if (access) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const getUserdata = async (req: Request, res: Response) => {
    let access = req.cookies.access_token;
    if (access) {
        const { id } = req.params;
        const UserdataAux = await Userdata.findByPk(id);
        if (UserdataAux) {
            res.json(UserdataAux);
        } else {
            res.status(404).json({ message: 'Error, Userdata not found' })
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getUserdataByUserID = async (req: Request, res: Response) => {
    let access = req.cookies.access_token;
    if (access) {
        const { userid } = req.params;
        const data = jwt.verify(access, SECRET_JWT_KEY);
        if (typeof data === 'object' && data !== null) {
            const user: PublicUser = data as PublicUser;
            let access = false;
        let i = 0;
        while(i<admin.length && !access){
            if(user.email === admin[i]){
                access = true;
            } else {
                i++;
            }
        }
            if (user.id == userid || access) {
                const UserAux = await Userdata.findOne({ where: { userID: userid } });
                if (UserAux) {
                    res.json(UserAux);
                } else {
                    res.status(404).json({ message: 'Error, Userdata not found' })
                }
            } else {
                res.send('Ruta protegida, tu ID no coincide con el id que buscas');
            }
        } else {
            res.send('Ruta protegida, la cookie no tiene cuerpo');
        }
    } else {
        res.send('Ruta protegida, no accediste');
    }
}

export const deleteUserdata = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const UserdataAux = await Userdata.findByPk(`${id}`);
            if (UserdataAux) {
                await UserdataAux.destroy();
                res.json({ message: 'Userdata successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Userdata not found' })
            }
        }
    }
}

export const postUserdata = async (req: Request, res: Response) => {
    const body = req.body;
    await Userdata.create(body);
    res.json({
        message: 'Userdata successfully created',
    })
}
export const updateUserdata = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const UserdataAux = await Userdata.findByPk(id);
    if (UserdataAux) {
        UserdataAux.update(body);
        res.json({
            message: 'Userdata updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, Userdata not found' })
    }
}
export const deleteUsersdata = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            await Userdata.destroy({ truncate: true });
        }
    }
}