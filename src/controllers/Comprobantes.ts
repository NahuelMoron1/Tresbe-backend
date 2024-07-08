import { Request, Response } from "express";
import Comprobantes from "../models/mysql/Comprobantes";
import fileUpload from 'express-fileupload'

export const getComprobantes = async (req: Request, res: Response) => {    
    const listProducts = await Comprobantes.findAll();
    res.json(listProducts);
}

export const getComprobante = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const comprobante = await Comprobantes.findByPk(id);
        if (!comprobante) {
          return res.status(404).send('Comprobante not found');
        }
    
        // Devolver el archivo como respuesta
        res.set('Content-Type', 'application/octet-stream'); // Tipo de contenido del archivo
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving comprobante file');
      }
}
export const deleteComprobante = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Comprobantes.findByPk(`${id}`);
    if(productAux){
        await productAux.destroy();
        res.json({message: 'Product successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, product not found'})
    }
}
/*export const postComprobante = async(req: Request, res: Response) => {
    if (!req.files || !req.body) {
        return res.status(400).send('No files or data were uploaded.');
      }
    
      const { id, orderID, userID } = req.body;
      const file = req.files.file;
      const uploadedFile = Array.isArray(file) ? file[0] : file;
      const fileData = uploadedFile.data; // Obtener los datos del archivo directamente del buffer
    await Comprobantes.create({
        id,
        orderID,
        userID,
        data: fileData
    });
    res.json({
        message: 'Product successfully created',
    })
}*/
export const updateComprobantes = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await Comprobantes.findByPk(id);
    if(productAux){
        productAux.update(body);
        res.json({
            message: 'Product updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const deleteComprobantes = async (req: Request, res: Response) => {
    await Comprobantes.destroy({truncate: true});
}