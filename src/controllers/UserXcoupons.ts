import { Request, Response } from "express";
import UserXcoupon from "../models/mysql/UserXcoupon";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getUserXcoupon = async (req: Request, res: Response) => {
    const { userID, couponID } = req.params;
    const UserAux = await UserXcoupon.findOne({ where: { userID: userID, couponID: couponID } });
    if (UserAux) {
        res.json(UserAux);
    } else {
        res.status(404).json({ message: 'Error, User not found' })
    }

}

export const deleteUser = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const UserAux = await UserXcoupon.findByPk(`${id}`);
            if (UserAux) {
                await UserAux.destroy();
                res.json({ message: 'User successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postUser = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;

            await UserXcoupon.create(body);
            res.json({
                message: 'User successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const UserAux = await UserXcoupon.findByPk(id);
    if (UserAux) {
        UserAux.update(body);
        res.json({
            message: 'User updated',
        })
    } else {
        res.status(404).json({ message: 'Error, User not found' })
    }
}
export const deleteUsers = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await UserXcoupon.destroy({ truncate: true });
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
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