import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../db/connection";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Products from "../models/mysql/Products";
import { PublicUser } from "../models/PublicUser";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const pageNumb = parseInt(page);
    const pageSize = 12; //Cantidad de elementos por pagina
    const totalProducts = await Products.count(); // Obtener el total de productos
    const totalPages = totalProducts / pageSize;
    // Si la página solicitada supera el número máximo de páginas, ajustarla a la última página
    const validPageNumb = pageNumb > totalPages ? totalPages : pageNumb;
    const offset = (validPageNumb - 1) * pageSize;
    const listProducts = await Products.findAll({
      limit: pageSize,
      offset: offset,
      order: [
        [sequelize.literal(`(brand = 'Tel')`), "DESC"], // Priorizar los productos de marca 'Tel'
        ["category", "ASC"], // Luego ordenar por categoría
        ["stock", "ASC"], // Después ordenar por stock
        ["brand", "ASC"], // Finalmente ordenar alfabéticamente por marca
      ],
    });

    if (!listProducts) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    return res.status(200).json(listProducts);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const countPages = async (req: Request, res: Response) => {
  try {
    const { brand } = req.params;
    const { type } = req.params;

    if (!brand || !type) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }
    const pageSize = 12; //Cantidad de elementos por pagina
    let totalProducts = 0;
    if (type == "all") {
      totalProducts = await Products.count(); // Obtener el total de productos
    } else {
      if (type == "brand") {
        totalProducts = await Products.count({ where: { brand: brand } }); // Obtener el total de productos
      } else {
        totalProducts = await Products.count({ where: { category: brand } }); // Obtener el total de productos
      }
    }
    const totalPages = totalProducts / pageSize;
    return res.status(200).json(Math.ceil(totalPages));
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await Products.findByPk(id);

    if (!productAux) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }
    return res.status(200).json(productAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const getProductsByBrands = async (req: Request, res: Response) => {
  try {
    const { brand } = req.params;
    const { page } = req.params;

    if (!brand) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

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
        ["category", "ASC"], // Ordenar por `category` en orden ascendente
        ["stock", "ASC"], // Ordenar por `category` en orden ascendente
      ],
    });

    if (!productsAux) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    return res.status(200).json(productsAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getRandomProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.sequelize?.query(
      `SELECT * FROM Products WHERE brand = 'Tel' ORDER BY RAND() LIMIT 3`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!products) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page } = req.params;

    if (!category || !page) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }
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
        ["category", "ASC"], // Ordenar por `category` en orden ascendente
        ["stock", "ASC"], // Ordenar por `name` en orden ascendente
      ],
    });
    if (productsAux) {
      return res.status(200).json(productsAux);
    } else {
      res.status(404).json({ message: "Error, product not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProductsBySearch = async (req: Request, res: Response) => {
  try {
    const { name, value, type } = req.params;
    const searchWords = name.split(" ").map((word) => word.toLowerCase());

    const whereConditions: any = {
      [Op.and]: searchWords.map((word) => ({
        name: { [Op.like]: `%${word}%` },
      })),
    };

    // Agregar la condición de brand si no es 'all'
    if (value !== "" && value != "all") {
      if (type == "brand") {
        whereConditions[Op.and].push({ brand: value });
      } else if (type == "category") {
        whereConditions[Op.and].push({ category: value });
      }
    }

    // Construimos la consulta para buscar todas las palabras
    const productsAux = await Products.findAll({
      where: whereConditions,
      order: [
        ["category", "ASC"], // Ordenar por `category` en orden ascendente
        ["name", "ASC"], // Ordenar por `name` en orden ascendente
      ],
    });

    if (!productsAux) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }

    return res.status(200).json(productsAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await Products.findByPk(`${id}`);

    if (!productAux) {
      return res
        .status(404)
        .json({ message: "No se encontró el producto a eliminar" });
    }

    await productAux.destroy();
    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const postProduct = async (req: Request, res: Response) => {
  try {
    const admin_token = req.cookies.admin_token;
    const access_token = req.cookies.access_token;
    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const body = req.body;
    if (!validateProduct(body)) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }
    await Products.create(body);
    return res.status(200).json({
      message: "Product successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

function validateProduct(body: any) {
  if (
    !body.name ||
    typeof body.name !== "string" ||
    !body.category ||
    typeof body.category !== "string" ||
    !body.image ||
    typeof body.image !== "string" ||
    !body.brand ||
    typeof body.brand !== "string"
  ) {
    return false;
  }

  return true;
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await Products.findByPk(id);

    if (!productAux) {
      return res
        .status(404)
        .json({ message: "No se encontró el producto a actualizar" });
    }

    await productAux.update(body);
    return res.status(200).json({
      message: "Product updated with success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteProducts = async (req: Request, res: Response) => {
  try {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    await Products.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Todos los productos fueron eliminados" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
const verifyAdmin = (adminToken: any) => {
  const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
  if (typeof dataAdmin === "object" && dataAdmin !== null) {
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
};
