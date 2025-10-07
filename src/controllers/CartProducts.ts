import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import CartProduct from "../models/mysql/CartProduct";
import { PublicUser } from "../models/PublicUser";

export const getCartProducts = async (req: Request, res: Response) => {
  try {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(admin_token)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const listProducts = await CartProduct.findAll();

    if (!listProducts) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos del carrito" });
    }

    return res.status(200).json(listProducts);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getCartProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await CartProduct.findByPk(id);

    if (!productAux) {
      return res
        .status(404)
        .json({ message: "No se encontró el producto de carrito" });
    }

    return res.status(200).json(productAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getCartProductsByOrder = async (req: Request, res: Response) => {
  try {
    const { orderID } = req.params;

    if (!orderID || typeof orderID !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productsAux = await CartProduct.findAll({
      where: { orderID: orderID },
    });

    if (!productsAux) {
      return res
        .status(404)
        .json({ message: "No se encontró el producto de carrito" });
    }

    return res.status(200).json(productsAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteCartProduct = async (req: Request, res: Response) => {
  try {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;
    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(admin_token)) {
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

    const productAux = await CartProduct.findByPk(`${id}`);

    if (!productAux) {
      return res.status(404).json({
        message: "No se encontró el producto de carrito buscado para eliminar",
      });
    }

    await productAux.destroy();
    res.status(200).json({ message: "Producto de carrito borrado con exito" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postCartProduct = async (req: Request, res: Response) => {
  try {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const body = req.body;

    await CartProduct.create(body);
    return res.status(200).json({
      message: "Producto de carrito guardado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const updateCartProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await CartProduct.findByPk(id);

    if (!productAux) {
      return res.status(404).json({
        message:
          "No se encontró el producto de carrito buscado para actualizar",
      });
    }

    await productAux.update(body);
    return res.status(200).json({
      message: "Producto de carrito actualizado con exito",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteCartProducts = async (req: Request, res: Response) => {
  try {
    const access_token = req.cookies.access_token;
    const admin_token = req.cookies.admin_token;

    if (!access_token || !admin_token) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(admin_token)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    await CartProduct.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Productos de carrito eliminados con exito" });
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
