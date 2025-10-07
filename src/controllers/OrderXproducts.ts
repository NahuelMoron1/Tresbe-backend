import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import { OrderXproducts } from "../models/mysql/orderXproducts";
import { PublicUser } from "../models/PublicUser";

export const getOrdersXproducts = async (req: Request, res: Response) => {
  try {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (!access || !tokenAux) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(tokenAux)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const listOrders = await OrderXproducts.findAll();
    if (!listOrders) {
      return res
        .status(404)
        .json({ message: "No se encontraron ordenes con productos" });
    }

    return res.status(200).json(listOrders);
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
    if (access) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getOrderXproducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    let access = req.cookies.access_token;
    if (!access) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const data = jwt.verify(access, SECRET_JWT_KEY);
    if (typeof data !== "object" || data === null) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const user = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
    if (user.id !== id && !verifyAdmin(access)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const OrderAux = await OrderXproducts.findByPk(id);

    if (!OrderAux) {
      return res
        .status(404)
        .json({ message: "No se encontro la orden con producto" });
    }

    return res.status(200).json(OrderAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getOxpByOrders = async (req: Request, res: Response) => {
  try {
    const { orderid } = req.params;

    if (!orderid || typeof orderid !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const ordersAux = await OrderXproducts.findAll({
      where: { orderId: orderid },
    });

    if (!ordersAux) {
      return res
        .status(404)
        .json({ message: "No se encontraron las ordenes con productos" });
    }
    return res.status(200).json(ordersAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteOrderXproducts = async (req: Request, res: Response) => {
  try {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (!access || !tokenAux) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(tokenAux)) {
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

    const OrderAux = await OrderXproducts.findByPk(`${id}`);
    if (!OrderAux) {
      return res.status(404).json({
        message: "No se encontro la orden con producto para eliminar",
      });
    }

    await OrderAux.destroy();
    return res
      .status(200)
      .json({ message: "OrderXproducts successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteOrderXproductsByIDs = async (
  req: Request,
  res: Response
) => {
  try {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (!access || !tokenAux) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(tokenAux)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const { productID } = req.params;
    const { orderID } = req.params;

    if (
      !productID ||
      typeof productID !== "string" ||
      !orderID ||
      typeof orderID !== "string"
    ) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const OrderAux = await OrderXproducts.findOne({
      where: {
        productId: productID,
        orderId: orderID,
      },
    });

    if (!OrderAux) {
      return res.status(404).json({
        message: "No se encontro la orden con producto para eliminar",
      });
    }

    await OrderAux.destroy();
    return res
      .status(200)
      .json({ message: "OrderXproducts successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postOrderXproducts = async (req: Request, res: Response) => {
  try {
    let access = req.cookies.access_token;
    const body = req.body;

    if (!access) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    await OrderXproducts.create(body);
    return res.status(200).json({
      message: "OrderXproducts successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const updateOrderXproducts = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const OrderAux = await OrderXproducts.findByPk(id);
    if (!OrderAux) {
      return res.status(404).json({
        message: "No se encontro la orden con producto para modificar",
      });
    }

    await OrderAux.update(body);
    return res.status(200).json({
      message: "OrderXproducts updated with success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteOrdersXproducts = async (req: Request, res: Response) => {
  try {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (!access || !tokenAux) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    if (!verifyAdmin(tokenAux)) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    await OrderXproducts.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Ordenes con productos eliminadas por completo" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
