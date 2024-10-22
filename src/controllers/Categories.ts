import { Request, Response } from "express";
import Categories from "../models/mysql/Categories";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const getCategories = async (req: Request, res: Response) => {
    const listFeatures = await Categories.findAll();
    res.json(listFeatures);
}

export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const CategoryAux = await Categories.findByPk(id);
    if (CategoryAux) {
        res.json(CategoryAux);
    } else {
        res.status(404).json({ message: 'Error, Category not found' })
    }
}
export const deleteCategory = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const CategoryAux = await Categories.findByPk(`${id}`);
            if (CategoryAux) {
                await Categories.destroy();
                res.json({ message: 'Category successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Category not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Permiso denegado');
    }
}
export const postCategory = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            await Categories.create(body);
            res.json({
                message: 'Category successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Permiso denegado');
    }
}
export const updateCategory = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const CategoryAux = await Categories.findByPk(id);
    if (CategoryAux) {
        CategoryAux.update(body);
        res.json({
            message: 'Categories updated',
        })
    } else {
        res.status(404).json({ message: 'Error, Category not found' })
    }
}
export const deleteCategories = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await Categories.destroy({ truncate: true });
        } else {
            res.send('Ruta protegida');
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