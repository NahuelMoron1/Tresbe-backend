import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Features from "../models/mysql/Features";
import { PublicUser } from "../models/PublicUser";

export const getFeatures = async (req: Request, res: Response) => {
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

    const listFeatures = await Features.findAll();

    if (!listFeatures) {
      return res
        .status(404)
        .json({ message: "No se encontraron las caracteristicas" });
    }

    return res.status(200).json(listFeatures);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const FeatureAux = await Features.findByPk(id);

    if (!FeatureAux) {
      return res
        .status(404)
        .json({ message: "No se encontraron las caracteristicas" });
    }
    return res.status(200).json(FeatureAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProductFeatures = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (!productID || typeof productID !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const FeatureAux = await Features.findAll({
      where: { product_id: productID },
    });

    if (!FeatureAux) {
      return res
        .status(404)
        .json({ message: "No se encontraron las caracteristicas" });
    }
    return res.status(200).json(FeatureAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteFeature = async (req: Request, res: Response) => {
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
    const FeatureAux = await Features.findByPk(`${id}`);

    if (!FeatureAux) {
      return res
        .status(404)
        .json({ message: "No se encontraron las caracteristicas" });
    }

    await FeatureAux.destroy();
    return res.status(200).json({ message: "Feature successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postFeature = async (req: Request, res: Response) => {
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
    if (!validateFeature(body)) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa los datos que enviaste",
      });
    }

    await Features.create(body);
    return res.status(200).json({
      message: "Feature successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

function validateFeature(body: any) {
  if (
    !body.product_id ||
    typeof body.product_id !== "string" ||
    !body.name ||
    typeof body.name !== "string"
  ) {
    return false;
  }
  return true;
}
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }
    const FeatureAux = await Features.findByPk(id);

    if (!FeatureAux) {
      return res
        .status(404)
        .json({ message: "No se encontraron las caracteristicas" });
    }

    await FeatureAux.update(body);
    return res.status(200).json({
      message: "Feature updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteFeatures = async (req: Request, res: Response) => {
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

    await Features.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Caracteristicas eliminadas correctamente" });
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
