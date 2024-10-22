import { Request, Response } from "express";
import Products from "../models/mysql/Products";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { admin } from "../models/config";
import jwt, { verify } from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
import { PublicUser } from "../models/PublicUser";

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
        order: [
            [sequelize.literal(`(brand = 'Tel')`), 'DESC'],  // Priorizar los productos de marca 'Tel'
            ['category', 'ASC'],                             // Luego ordenar por categoría
            ['stock', 'ASC'],                                // Después ordenar por stock
            ['brand', 'ASC']                                 // Finalmente ordenar alfabéticamente por marca
        ]
    });
    res.json(listProducts);
}

export const countPages = async (req: Request, res: Response) => {
    const { brand } = req.params;
    const { type } = req.params;
    const pageSize = 12; //Cantidad de elementos por pagina
    let totalProducts = 0;
    if (type == 'all') {
        totalProducts = await Products.count(); // Obtener el total de productos
    } else {
        if (type == 'brand') {
            totalProducts = await Products.count({ where: { brand: brand } }); // Obtener el total de productos
        } else {
            totalProducts = await Products.count({ where: { category: brand } }); // Obtener el total de productos
        }
    }
    const totalPages = (totalProducts / pageSize);
    res.json(Math.ceil(totalPages));
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Products.findByPk(id);
    if (productAux) {
        res.json(productAux);
    } else {
        res.status(404).json({ message: 'Error, Product not found' })
    }
}
export const getProductsByBrands = async (req: Request, res: Response) => {
    const { brand } = req.params;
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = await Products.count(); // Obtener el total de productos
    const totalPages = Math.ceil(totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;

    const productsAux = await Products.findAll({
        where: { brand: brand },
        limit: pageSize,
        offset: offset,
        order: [
            ['category', 'ASC'], // Ordenar por `category` en orden ascendente
            ['stock', 'ASC'], // Ordenar por `category` en orden ascendente
        ],
    });
    if (productsAux) {
        res.json(productsAux);
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}

export const getRandomProducts = async (req: Request, res: Response) => {
    const products = await Products.sequelize?.query(
        `SELECT * FROM Products WHERE brand = 'Tel' ORDER BY RAND() LIMIT 3`,
        {
            type: QueryTypes.SELECT
        }
    );

    if (products) {
        res.json(products);
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = await Products.count(); // Obtener el total de productos
    const totalPages = Math.ceil(totalProducts / pageSize);
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;

    const productsAux = await Products.findAll({
        where: { category: category },
        limit: pageSize,
        offset: offset,
        order: [
            ['category', 'ASC'], // Ordenar por `category` en orden ascendente
            ['stock', 'ASC']       // Ordenar por `name` en orden ascendente
        ],
    });
    if (productsAux) {
        res.json(productsAux);
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}

export const getProductsBySearch = async (req: Request, res: Response) => {
    const { name, value, type } = req.params;
    const searchWords = name.split(' ').map(word => word.toLowerCase());

    const whereConditions: any = {
        [Op.and]: searchWords.map(word => ({
            name: { [Op.like]: `%${word}%` }
        }))
    };

    // Agregar la condición de brand si no es 'all'
    if (value !== '' && value != 'all') {
        if (type == 'brand') {
            whereConditions[Op.and].push({ brand: value });
        } else if (type == 'category') {
            whereConditions[Op.and].push({ category: value });
        }
    }

    // Construimos la consulta para buscar todas las palabras
    const productsAux = await Products.findAll({
        where: whereConditions,
        order: [
            ['category', 'ASC'], // Ordenar por `category` en orden ascendente
            ['name', 'ASC']       // Ordenar por `name` en orden ascendente
        ],
    });

    if (productsAux) {
        res.json(productsAux);
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const { id } = req.params;
        const productAux = await Products.findByPk(`${id}`);
        if (productAux) {
            await productAux.destroy();
            res.json({ message: 'Product successfully deleted' });
        } else {
            res.status(404).json({ message: 'Error, product not found' })
        }
    } else {
        res.send('Permiso denegado');
    }
}
export const postProduct = async (req: Request, res: Response) => {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (access_token && admin_token) {
        const body = req.body;
        await Products.create(body);
        res.json({
            message: 'Product successfully created',
        })
    } else {
        res.send('Permiso denegado');
    }
}
export const updateProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await Products.findByPk(id);
    if (productAux) {
        productAux.update(body);
        res.json({
            message: 'Product updated with success',
        })
    } else {
        res.status(404).json({ message: 'Error, product not found' })
    }
}
export const deleteProducts = async (req: Request, res: Response) => {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (access_token && admin_token) {
    await Products.destroy({ truncate: true });
    }else{
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