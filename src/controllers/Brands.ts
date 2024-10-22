import { Request, Response } from "express";
import Brands from "../models/mysql/Brands";
import sequelize from "../db/connection";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getBrands = async (req: Request, res: Response) => {
    const listBrands = await Brands.findAll({
        order: [
            // Primero ponemos las marcas cuyo nombre es 'Tel'
            [sequelize.literal(`CASE WHEN name = 'Tel' THEN 0 ELSE 1 END`), 'ASC'],
            // Luego ordenamos las demás marcas en orden descendente por name
            ['name', 'DESC']
        ]
    });
    res.json(listBrands);
}

export const getBrand = async (req: Request, res: Response) => {
    const { id } = req.params;
    const BrandAux = await Brands.findByPk(id);
    if (BrandAux) {
        res.json(BrandAux);
    } else {
        res.status(404).json({ message: 'Error, Brand not found' })
    }
}
export const deleteBrand = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const BrandAux = await Brands.findByPk(`${id}`);
            if (BrandAux) {
                await BrandAux.destroy();
                res.json({ message: 'Brand successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Brand not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Permiso denegado');
    }
}
export const postBrands = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            await Brands.create(body);
            res.json({
                message: 'Brand successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Permiso denegado');
    }
}
export const updateBrand = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const BrandsAux = await Brands.findByPk(id);
    if (BrandsAux) {
        BrandsAux.update(body);
        res.json({
            message: 'Brand updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, Brand not found' })
    }
}
export const deleteBrands = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await Brands.destroy({ truncate: true });
        }
    } else {
        res.send('Permiso denegado');
    }
}
const verifyAdmin = (adminToken: any) => {
    const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
        const userAux: PublicUser = dataAdmin as PublicUser;
        let access = false;
        let i = 0;
        while (i < admin.length && !access) {
            if (userAux.email === admin[i]) {
                access = true;
            } else {
                i++;
            }
        }
        return access;
    } else {
        return false;
    }
}