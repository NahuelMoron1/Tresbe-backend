import { Request, Response } from "express";
import Options from "../models/mysql/Options";

export const getOptions = async (req: Request, res: Response) => {    
    const listOptions = await Options.findAll();
    res.json(listOptions);
}

export const getOption = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OptionAux = await Options.findByPk(id);    
    if(OptionAux){
        res.json(OptionAux);
    } else {
        res.status(404).json({message: 'Error, Option not found'})
    }
}

export const getProductOptions = async (req: Request, res: Response) => {
    const { productID } = req.params;
    const OptionAux = await Options.findAll({where: {productID: productID}});    
    if(OptionAux){
        res.json(OptionAux);
    } else {
        res.status(404).json({message: 'Error, Options not found'})
    }
}
export const getProductOptionsByTwo = async (req: Request, res: Response) => {
    const { productID } = req.params;
    const { optionName } = req.params;
    const OptionAux = await Options.findOne({where: {name: optionName} && {productID: productID}});    
    if(OptionAux){
        res.json(OptionAux);
    } else {
        res.status(404).json({message: 'Error, Options not found'})
    }
}

export const getProductOptionsByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    const OptionAux = await Options.findOne({where: {name: name}});    
    if(OptionAux){
        res.json(OptionAux);
    } else {
        res.status(404).json({message: 'Error, Options not found'})
    }
}

export const deleteOption = async (req: Request, res: Response) => {
    const { id } = req.params;
    const OptionAux = await Options.findByPk(`${id}`);
    if(OptionAux){
        await OptionAux.destroy();
        res.json({message: 'Option successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Option not found'})
    }
}
export const postOption = async(req: Request, res: Response) => {
    const body = req.body;
    await Options.create(body);
    res.json({
        message: 'Option successfully created',
    })
}
export const updateOption = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const OptionAux = await Options.findByPk(id);
    if(OptionAux){
        OptionAux.update(body);
        res.json({
            message: 'Option updated',
        })
    } else {
        res.status(404).json({message: 'Error, Option not found'})
    }
}
export const deleteOptions = async (req: Request, res: Response) => {
    await Options.destroy({truncate: true});
}