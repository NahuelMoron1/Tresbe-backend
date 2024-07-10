import { Request, Response } from "express";
import PriceXproducts from "../models/mysql/PriceXproducts";

export const getPriceXproducts = async (req: Request, res: Response) => {    
    const listProducts = await PriceXproducts.findAll();
    res.json(listProducts);
}

export const getPriceXproduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await PriceXproducts.findByPk(id);    
    if(productAux){
        res.json(productAux);
    } else {
        res.status(404).json({message: 'Error, Product not found'})
    }
}

export const getTableByProduct = async (req: Request, res: Response) => {
    const { productID } = req.params;
    
    const tableAux = await PriceXproducts.findOne({where: {productID: productID}});  
    console.log('hellooo');
      
    if(tableAux){
        res.json(tableAux);
    } else {
        res.status(404).json({message: 'Error, Userdata not found'})
    }
}

export const deletePriceXproduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await PriceXproducts.findByPk(`${id}`);
    if(productAux){
        await productAux.destroy();
        res.json({message: 'Product successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const postPriceXproduct = async(req: Request, res: Response) => {
    const body = req.body;
    await PriceXproducts.create(body);
    res.json({
        message: 'Product successfully created',
    })
}
export const updatePriceXproduct = async(req: Request, res: Response) => {
    
    const body = req.body;
    
    const { id } = req.params;
    const productAux = await PriceXproducts.findByPk(id);
    
    if(productAux){
        productAux.update(body);
        res.json({
            message: 'Product updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const deletePriceXproducts = async (req: Request, res: Response) => {
    await PriceXproducts.destroy({truncate: true});
}