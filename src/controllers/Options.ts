import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, SECRET_JWT_KEY } from "../models/config";
import Options from "../models/mysql/Options";
import { PublicUser } from "../models/PublicUser";
export const getOptions = async (req: Request, res: Response) => {
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

    const listOptions = await Options.findAll();

    if (!listOptions) {
      return res.status(404).json({ message: "No se encontraron opciones" });
    }

    return res.status(200).json(listOptions);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    console.log("ON GET OPTION");

    const OptionAux = await Options.findByPk(id);

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    return res.status(200).json(OptionAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProductOptions = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (!productID || typeof productID !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const OptionAux = await Options.findAll({
      where: { productID: productID },
    });

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    return res.status(200).json(OptionAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const getProductOptionsByTwo = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;
    const { optionName } = req.params;
    const optionValid = decodeURIComponent(optionName);

    if (
      !productID ||
      typeof productID !== "string" ||
      !optionName ||
      typeof optionName !== "string"
    ) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const OptionAux = await Options.findOne({
      where: { name: optionValid, productID: productID },
    });

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    return res.status(200).json(OptionAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const getProductOptionsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }
    const OptionAux = await Options.findOne({ where: { name: name } });

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    return res.status(200).json(OptionAux);
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteOptionByProduct = async (req: Request, res: Response) => {
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
    const OptionAux = await Options.findAll({ where: { productID: id } });

    if (!OptionAux || OptionAux.length <= 0) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    if (OptionAux.length < 2) {
      await OptionAux[0].destroy();
    } else {
      for (let i = 0; i < OptionAux.length; i++) {
        await OptionAux[i].destroy();
      }
    }
    return res.status(200).json({ message: "Options successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

export const deleteOption = async (req: Request, res: Response) => {
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
    const OptionAux = await Options.findByPk(`${id}`);

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }

    await OptionAux.destroy();
    return res.status(200).json({ message: "Option successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const postOption = async (req: Request, res: Response) => {
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

    const body = req.body;
    if (!validateOption(body)) {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa los datos que enviaste",
      });
    }

    await Options.create(body);
    return res.status(200).json({
      message: "Option successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};

function validateOption(body: any) {
  if (
    !body.productID ||
    typeof body.productID !== "string" ||
    !body.name ||
    typeof body.name !== "string" ||
    (body.stock && typeof body.stock !== "number")
  ) {
    return false;
  }
  return true;
}
export const updateOption = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { oldID } = req.params;

    if (!oldID || typeof oldID !== "string") {
      return res.status(400).json({
        message: "Formato de datos mal enviado, revisa bien lo que enviaste",
      });
    }

    const OptionAux = await Options.findByPk(oldID);

    if (!OptionAux) {
      return res.status(404).json({ message: "No se encontró la opcion" });
    }
    let varaux = await Options.update(
      {
        id: body.id,
        name: body.name,
        productID: body.productID,
        stock: body.stock,
      },
      { where: { id: oldID } }
    );
    return res.status(200).json({
      message: "Option updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Hubo un error, ponete en contacto con sistemas: ",
      error,
    });
  }
};
export const deleteOptions = async (req: Request, res: Response) => {
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

    await Options.destroy({ truncate: true });
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
