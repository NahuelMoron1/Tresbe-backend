import { Request, Response } from "express";
import Features from "../models/mysql/Features";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getFeatures = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const listFeatures = await Features.findAll();
            res.json(listFeatures);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getFeature = async (req: Request, res: Response) => {
    const { id } = req.params;
    const FeatureAux = await Features.findByPk(id);
    if (FeatureAux) {
        res.json(FeatureAux);
    } else {
        res.status(404).json({ message: 'Error, Feature not found' })
    }
}

export const getProductFeatures = async (req: Request, res: Response) => {
    const { productID } = req.params;
    const FeatureAux = await Features.findAll({ where: { product_id: productID } });
    if (FeatureAux) {
        res.json(FeatureAux);
    } else {
        res.status(404).json({ message: 'Error, Features not found' })
    }
}

export const deleteFeature = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const FeatureAux = await Features.findByPk(`${id}`);
            if (FeatureAux) {
                await FeatureAux.destroy();
                res.json({ message: 'Feature successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Feature not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postFeature = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            await Features.create(body);
            res.json({
                message: 'Feature successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updateFeature = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const FeatureAux = await Features.findByPk(id);
    if (FeatureAux) {
        FeatureAux.update(body);
        res.json({
            message: 'Feature updated',
        })
    } else {
        res.status(404).json({ message: 'Error, Feature not found' })
    }
}
export const deleteFeatures = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await Features.destroy({ truncate: true });
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
        if (userAux.email == admin) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}