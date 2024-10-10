import { Request, Response } from "express";
import PriceXproducts from "../models/mysql/PriceXproducts";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";
import { PriceXproduct } from "../models/PriceXproducts";

export const getPriceXproducts = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const listProducts = await PriceXproducts.findAll();
            res.json(listProducts);
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getPriceXproduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await PriceXproducts.findByPk(id);
    if (productAux) {
        res.json(productAux);
    } else {
        res.status(404).json({ message: 'Error, Product not found' })
    }
}

export const getTableByProduct = async (req: Request, res: Response) => {
    const { optionID } = req.params;

    const tableAux = await PriceXproducts.findOne({ where: { optionID: optionID } });
    if (tableAux) {
        res.json(tableAux);
    } else {
        res.status(404).json({ message: 'Error, Userdata not found' })
    }
}

export const deletePriceXproductByOptionID = async (id: number) => {
    const productAux = await PriceXproducts.findOne({ where: { optionID: id } });
    if (productAux) {
        await productAux.destroy();
        return 'DELETED';
    } else {
        return 'Error';
    }
}

export const deletePriceXproduct = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const { id } = req.params;
            const productAux = await PriceXproducts.findByPk(`${id}`);
            if (productAux) {
                await productAux.destroy();
                res.json({ message: 'Product successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, product not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postPriceXproduct = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            const body = req.body;
            await PriceXproducts.create(body);
            res.json({
                message: 'Product successfully created',
            })
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updatePriceXproduct = async (req: Request, res: Response) => {

    const body = req.body;

    const { id } = req.params;
    const productAux = await PriceXproducts.findByPk(id);

    if (productAux) {
        await productAux.update(body);
        res.json({
            message: 'Product updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}
export const updateOptionID = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await PriceXproducts.findOne({where: {optionID: id}});
    if(typeof productAux === 'object' && productAux != null){
        const pricesAux: PriceXproduct = productAux as unknown as PriceXproduct;
        pricesAux.optionID = body.optionID;        
        ///await productAux.update(pricesAux);
        await PriceXproducts.update({ optionID: pricesAux.optionID }, { where: { id: pricesAux.id } });
        res.json({
            message: 'OPTION ID updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}
export const deletePriceXproducts = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
        if (verifyAdmin(admin_token)) {
            await PriceXproducts.destroy({ truncate: true });
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