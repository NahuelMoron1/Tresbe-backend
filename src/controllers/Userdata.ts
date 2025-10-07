import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Userdata from "../models/mysql/Userdata";
import { PublicUser } from "../models/PublicUser";

export const getUsersdata = async (req: Request, res: Response) => {
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

    const listUsersdata = await Userdata.findAll();
    if (!listUsersdata) {
      return res
        .status(404)
        .json({ message: "No se encontraron las listas de data de usuario" });
    }

    return res.status(200).json(listUsersdata);
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

export const getUserdata = async (req: Request, res: Response) => {
  try {
    let access = req.cookies.access_token;
    if (!access) {
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

    const UserdataAux = await Userdata.findByPk(id);
    if (!UserdataAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la data de usuario" });
    }

    return res.status(200).json(UserdataAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getUserdataByUserID = async (req: Request, res: Response) => {
  try {
    let access = req.cookies.access_token;

    if (!access) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const { userid } = req.params;
    const data = jwt.verify(access, SECRET_JWT_KEY);

    if (typeof data !== "object" || data === null) {
      return res
        .status(401)
        .json({ message: "No tenes permiso para realizar esta acción" });
    }

    const user: PublicUser = data as PublicUser;
    let accessAux = false;
    let i = 0;
    while (i < admin.length && !accessAux) {
      if (user.email === admin[i]) {
        accessAux = true;
      } else {
        i++;
      }
    }

    if (user.id == userid || access) {
      const UserAux = await Userdata.findOne({ where: { userID: userid } });
      if (UserAux) {
        return res.status(200).json(UserAux);
      } else {
        res.status(404).json({ message: "Error, Userdata not found" });
      }
    } else {
      res.send("Ruta protegida, tu ID no coincide con el id que buscas");
    }
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteUserdata = async (req: Request, res: Response) => {
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

    const UserdataAux = await Userdata.findByPk(`${id}`);
    if (!UserdataAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la data de usuario para eliminar" });
    }
    await UserdataAux.destroy();
    return res.status(200).json({ message: "Userdata successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const postUserdata = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    await Userdata.create(body);
    return res.status(200).json({
      message: "Userdata successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const updateUserdata = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const UserdataAux = await Userdata.findByPk(id);
    if (!UserdataAux) {
      return res
        .status(404)
        .json({ message: "No se encontró la data de usuario para modificar" });
    }

    await UserdataAux.update(body);
    return res.status(200).json({
      message: "Userdata updated with success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteUsersdata = async (req: Request, res: Response) => {
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

    await Userdata.destroy({ truncate: true });
    return res
      .status(200)
      .json({ message: "Data de usuarios borrada por completo" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
