import { Request, Response } from "express";
import Options from "../models/mysql/Options";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";
import { Option } from "../models/Options";
export const getOptions = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const listOptions = await Options.findAll();
            res.json(listOptions);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getOption = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OptionAux = await Options.findByPk(id);
    if (OptionAux) {
        res.json(OptionAux);
    } else {
        res.status(404).json({ message: 'Error, Option not found' })
    }
}

export const getProductOptions = async (req: Request, res: Response) => {
    const { productID } = req.params;
    const OptionAux = await Options.findAll({ where: { productID: productID } });
    if (OptionAux) {
        res.json(OptionAux);
    } else {
        res.status(404).json({ message: 'Error, Options not found' })
    }
}
export const getProductOptionsByTwo = async (req: Request, res: Response) => {
    const { productID } = req.params;
    const { optionName } = req.params;
    const optionValid = decodeURIComponent(optionName);

    const OptionAux = await Options.findOne({ where: { name: optionValid } && { productID: productID } });
    if (OptionAux) {
        res.json(OptionAux);
    } else {
        res.status(404).json({ message: 'Error, Options not found' })
    }
}

export const getProductOptionsByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    const OptionAux = await Options.findOne({ where: { name: name } });
    if (OptionAux) {
        res.json(OptionAux);
    } else {
        res.status(404).json({ message: 'Error, Options not found' })
    }
}

export const deleteOptionByProduct = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const OptionAux = await Options.findAll({ where: { productID: id } });
            if (OptionAux) {
                if (OptionAux.length > 0) {
                    if (OptionAux.length < 2) {
                        await OptionAux[0].destroy();
                    } else {
                        for (let i = 0; i < OptionAux.length; i++) {
                            await OptionAux[i].destroy();
                        }
                    }
                    res.json({ message: 'Options successfully deleted' });
                }
            } else {
                res.status(404).json({ message: 'Error, Options not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const deleteOption = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const OptionAux = await Options.findByPk(`${id}`);
            if (OptionAux) {
                await OptionAux.destroy();
                res.json({ message: 'Option successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, Option not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postOption = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const body = req.body;
            await Options.create(body);
            res.json({
                message: 'Option successfully created',
            });
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updateOption = async (req: Request, res: Response) => {
    const body = req.body;
    const { oldID } = req.params;
    const OptionAux = await Options.findByPk(oldID);
    if (OptionAux) {
        let varaux = await Options.update({ id: body.id, name: body.name, productID: body.productID, stock: body.stock }, { where: { id: oldID } });
        res.json({
            message: 'Option updated',
        })
    } else {
        res.status(404).json({ message: 'Error, Option not found' })
    }
}
export const deleteOptions = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            await Options.destroy({ truncate: true });
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
        return access;
    } else {
        return false;
    }
}