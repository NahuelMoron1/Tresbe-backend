import { Request, Response } from "express";
import Brands from "../models/mysql/Brands";
import sequelize from "../db/connection";

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
    if(BrandAux){
        res.json(BrandAux);
    } else {
        res.status(404).json({message: 'Error, Brand not found'})
    }
}
export const deleteBrand = async (req: Request, res: Response) => {
    const { id } = req.params;
    const BrandAux = await Brands.findByPk(`${id}`);
    if(BrandAux){
        await BrandAux.destroy();
        res.json({message: 'Brand successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Brand not found'})
    }
}
export const postBrands = async(req: Request, res: Response) => {
    const body = req.body;
    await Brands.create(body);
    res.json({
        message: 'Brand successfully created',
    })
}
export const updateBrand = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const BrandsAux = await Brands.findByPk(id);
    if(BrandsAux){
        BrandsAux.update(body);
        res.json({
            message: 'Brand updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, Brand not found'})
    }
}
export const deleteBrands = async (req: Request, res: Response) => {
    await Brands.destroy({truncate: true});
}