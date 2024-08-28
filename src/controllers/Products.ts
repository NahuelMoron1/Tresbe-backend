import { Request, Response } from "express";
import Products from "../models/mysql/Products";
import { Op, QueryTypes } from "sequelize";

export const getProducts = async (req: Request, res: Response) => {  
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = await Products.count(); // Obtener el total de productos
    const totalPages = (totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;
    const listProducts = await Products.findAll({
        limit: pageSize,
        offset: offset,
    });
    res.json(listProducts);
}

export const countPages = async (req: Request, res: Response) => {
   const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = await Products.count(); // Obtener el total de productos
    
    const totalPages = (totalProducts / pageSize);
    res.json(Math.ceil(totalPages));
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Products.findByPk(id);    
    if(productAux){
        res.json(productAux);
    } else {
        res.status(404).json({message: 'Error, Product not found'})
    }
}
export const getProductsByBrands = async (req: Request, res: Response) => {
    const { brand } = req.params;
    
    const productsAux = await Products.findAll({where: {brand: brand}});
    if(productsAux){
        res.json(productsAux);
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}

export const getRandomProducts = async (req: Request, res: Response) => {
    const products = await Products.sequelize?.query(
      `SELECT * FROM Products ORDER BY RAND() LIMIT 3`,
      {
        type: QueryTypes.SELECT
      }
    );

    if(products){
        res.json(products);
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
  };

export const getProductsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    
    const productsAux = await Products.findAll({where: {category: category}});
    if(productsAux){
        res.json(productsAux);
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}

export const getProductsBySearch = async (req: Request, res: Response) => {
    const { name, brand } = req.params;
    const searchWords = name.split(' ').map(word => word.toLowerCase());

    const whereConditions: any = {
        [Op.and]: searchWords.map(word => ({
            name: { [Op.like]: `%${word}%` }
        }))
    };
    
    // Agregar la condición de brand si no es 'all'
    if (brand !== '' && brand != 'all') {
        whereConditions[Op.and].push({ brand: brand });
    }

    // Construimos la consulta para buscar todas las palabras
    const productsAux = await Products.findAll({
        where: whereConditions
    });
    
    if(productsAux){
        res.json(productsAux);
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Products.findByPk(`${id}`);
    if(productAux){
        await productAux.destroy();
        res.json({message: 'Product successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const postProduct = async(req: Request, res: Response) => {
    const body = req.body;
    await Products.create(body);
    res.json({
        message: 'Product successfully created',
    })
}
export const updateProduct = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;

    
    const productAux = await Products.findByPk(id);
    if(productAux){
        productAux.update(body);
        res.json({
            message: 'Product updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const deleteProducts = async (req: Request, res: Response) => {
    await Products.destroy({truncate: true});
}