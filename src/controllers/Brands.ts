import { Request, Response } from "express";
import Brands from "../models/mysql/Brands";

export const getBrands = async (req: Request, res: Response) => {    
    const listBrands = await Brands.findAll();
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