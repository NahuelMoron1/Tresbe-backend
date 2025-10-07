import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import PriceXproducts from "../models/mysql/PriceXproducts";
import { PriceXproduct } from "../models/PriceXproducts";
import { PublicUser } from "../models/PublicUser";

export const getPriceXproducts = async (req: Request, res: Response) => {
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
    const listProducts = await PriceXproducts.findAll();

    if (!listProducts) {
      return res
        .status(404)
        .json({ message: "No se encontraron precios por producto" });
    }

    return res.status(200).json(listProducts);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getPriceXproduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await PriceXproducts.findByPk(id);
    if (!productAux) {
      return res
        .status(404)
        .json({ message: "No se encontró el precio por producto buscado" });
    }
    return res.status(200).json(productAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getTableByProduct = async (req: Request, res: Response) => {
  try {
    const { optionID } = req.params;

    if (!optionID || typeof optionID !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const tableAux = await PriceXproducts.findOne({
      where: { optionID: optionID },
    });

    if (!tableAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la tabla buscada por producto" });
    }

    return res.status(200).json(tableAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deletePriceXproductByOptionID = async (id: number) => {
  try {
    const productAux = await PriceXproducts.findOne({
      where: { optionID: id },
    });
    if (productAux) {
      await productAux.destroy();
      return "DELETED";
    } else {
      return "Error";
    }
  } catch (error) {
    return "Error";
  }
};

export const deletePriceXproduct = async (req: Request, res: Response) => {
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

    const productAux = await PriceXproducts.findByPk(`${id}`);
    if (!productAux) {
      return res.status(404).json({
        message: "No se encontró el precio por producto buscado para eliminar",
      });
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
export const postPriceXproduct = async (req: Request, res: Response) => {
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

    const body = req.body;
    if (!validatePriceXproducts(body)) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa los datos que enviaste",
      });
    }

    await PriceXproducts.create(body);
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

function validatePriceXproducts(body: any) {
  if (
    !body.optionID ||
    typeof body.optionID !== "string" ||
    !body.priceList1 ||
    typeof body.priceList1 !== "number" ||
    !body.priceList2 ||
    typeof body.priceList2 !== "number" ||
    !body.priceList3 ||
    typeof body.priceList3 !== "number" ||
    !body.priceList4 ||
    typeof body.priceList4 !== "number" ||
    !body.priceListE ||
    typeof body.priceListE !== "number" ||
    !body.priceListG ||
    typeof body.priceListG !== "number" ||
    !body.costPrice ||
    typeof body.costPrice !== "number"
  ) {
    return false;
  }
  return true;
}

export const updatePriceXproduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await PriceXproducts.findByPk(id);
    if (!productAux) {
      return res.status(404).json({
        message:
          "No se encontró el precio por producto buscado para actualizar",
      });
    }

    await productAux.update(body);
    return res.status(200).json({
      message: "Producto modificado con exito",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const updateOptionID = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const productAux = await PriceXproducts.findOne({
      where: { optionID: id },
    });

    if (typeof productAux !== "object" || productAux === null) {
      return res.status(404).json({
        message:
          "No se encontró el precio por producto buscado para actualizar",
      });
    }

    const pricesAux: PriceXproduct = productAux as unknown as PriceXproduct;
    pricesAux.optionID = body.optionID;
    await PriceXproducts.update(
      { optionID: pricesAux.optionID },
      { where: { id: pricesAux.id } }
    );

    return res.status(200).json({
      message: "OPTION ID updated with success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deletePriceXproducts = async (req: Request, res: Response) => {
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

    await PriceXproducts.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Precios por productos eliminados en su totalidad" });
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
