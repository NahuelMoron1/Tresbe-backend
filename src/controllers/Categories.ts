import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Categories from "../models/mysql/Categories";
import { PublicUser } from "../models/PublicUser";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const listFeatures = await Categories.findAll();
    if (!listFeatures) {
      return res
        .status(404)
        .json({ message: "No se encontraron las categorias" });
    }
    return res.status(200).json(listFeatures);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const CategoryAux = await Categories.findByPk(id);

    if (!CategoryAux) {
      return res.status(404).json({ message: "No se encontró esta categoria" });
    }

    return res.status(200).json(CategoryAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
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

    const CategoryAux = await Categories.findByPk(`${id}`);

    if (!CategoryAux) {
      return res.status(404).json({ message: "No se encontró esta categoria" });
    }

    await Categories.destroy();
    return res.status(200).json({ message: "Categoria eliminada con exito" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postCategory = async (req: Request, res: Response) => {
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
    await Categories.create(body);
    return res.status(200).json({
      message: "Category successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const CategoryAux = await Categories.findByPk(id);

    if (!CategoryAux) {
      return res
        .status(404)
        .json({ message: "No se encontró esta categoria para actualizar" });
    }

    await CategoryAux.update(body);
    res.json({
      message: "Categoria actualizada",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteCategories = async (req: Request, res: Response) => {
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

    await Categories.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Todas las categorias fueron borradas" });
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
