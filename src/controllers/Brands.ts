import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import sequelize from "../db/connection";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Brands from "../models/mysql/Brands";
import { PublicUser } from "../models/PublicUser";

export const getBrands = async (req: Request, res: Response) => {
  try {
    const listBrands = await Brands.findAll({
      order: [
        // Primero ponemos las marcas cuyo nombre es 'Tel'
        [sequelize.literal(`CASE WHEN name = 'Tel' THEN 0 ELSE 1 END`), "ASC"],
        // Luego ordenamos las demás marcas en orden descendente por name
        ["name", "DESC"],
      ],
    });
    if (!listBrands) {
      return res.status(404).json({ message: "No se encontraron las marcas" });
    }
    return res.json(listBrands);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const BrandAux = await Brands.findByPk(id);

    if (!BrandAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la marca buscada" });
    }

    return res.json(BrandAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteBrand = async (req: Request, res: Response) => {
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

    const BrandAux = await Brands.findByPk(`${id}`);

    if (!BrandAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la marca buscada para eliminar" });
    }

    await BrandAux.destroy();
    return res.status(200).json({ message: "Brand successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postBrands = async (req: Request, res: Response) => {
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
    if (!validateBrand(body)) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    await Brands.create(body);
    res.status(200).json({
      message: "Marca creada con exito",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

function validateBrand(body: any) {
  if (
    !body.name ||
    !body.image ||
    typeof body.name !== "string" ||
    typeof body.image !== "string"
  ) {
    return false;
  }

  return true;
}
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const BrandsAux = await Brands.findByPk(id);

    if (!BrandsAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la marca buscada para eliminar" });
    }

    await BrandsAux.update(body);
    res.json({
      message: "Brand updated with success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteBrands = async (req: Request, res: Response) => {
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

    await Brands.destroy({ truncate: true });
    return res.status(200).json({ message: "todas las marcas borradas" });
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
