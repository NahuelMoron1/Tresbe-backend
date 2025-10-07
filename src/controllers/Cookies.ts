import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { admin, DOMAIN, SECRET_JWT_KEY, superAdmin } from "../models/config";
import { PublicUser } from "../models/PublicUser";

export const tokenExist = (req: Request, res: Response) => {
  const { cookieName } = req.params;
  const token = req.cookies[cookieName];
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    if (token) {
      return res.json(true); // Usamos return para evitar que siga ejecutando código
    } else {
      return res.json(false); // Usamos return para evitar que siga ejecutando código
    }
  } else {
    if (cookieName == "admin_token") {
      if (!token) {
        return res.json(false); // Usamos return para evitar que siga ejecutando código
      } else {
        const adminToken = jwt.verify(token, SECRET_JWT_KEY);
        if (typeof adminToken === "object" && token !== null) {
          const userAux: PublicUser = adminToken as PublicUser;
          let access = false;
          let i = 0;
          while (i < admin.length && !access) {
            if (userAux.email === admin[i]) {
              access = true;
            } else {
              i++;
            }
          }
          return res.json(access);
        } else {
          res.json(false);
        }
      }
    } else {
      try {
        const data = jwt.verify(refreshToken, SECRET_JWT_KEY);
        if (typeof data === "object" && data !== null) {
          const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
          const access_token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              priceList: user.priceList,
              username: user.username,
              client: user.client,
              seller: user.seller,
            },
            SECRET_JWT_KEY,
            { expiresIn: "1h" }
          );

          res.cookie("access_token", access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            domain: DOMAIN,
            sameSite: "none",
            maxAge: 1000 * 60 * 60,
          });

          let access = false;
          let i = 0;
          while (i < admin.length && !access) {
            if (user.email === admin[i]) {
              access = true;
            } else {
              i++;
            }
          }
          if (access) {
            const admin_token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                priceList: user.priceList,
                username: user.username,
                client: user.client,
                seller: user.seller,
              },
              SECRET_JWT_KEY,
              { expiresIn: "1h" }
            );
            res.cookie("admin_token", admin_token, {
              path: "/",
              httpOnly: true,
              secure: true,
              domain: DOMAIN,
              sameSite: "none",
              maxAge: 1000 * 60 * 60,
            });
          }
          return res.json(true); // Usamos return para evitar que siga ejecutando código
        } else {
          return res.status(401).send("Acceso denegado"); // Enviamos respuesta y detenemos la ejecución
        }
      } catch (error) {
        return res.status(401).send("acceso denegado"); // Enviamos respuesta en caso de error y detenemos la ejecución
      }
    }
  }
};

export const getToken = (req: Request, res: Response) => {
  const { cookieName } = req.params;
  const token = req.cookies[cookieName];

  if (!token) {
    return res.json(false); // Usamos return para detener la ejecución
  } else {
    try {
      const data = jwt.verify(token, SECRET_JWT_KEY);
      if (typeof data === "object" && data !== null) {
        const user: PublicUser = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
        return res.json(user); // Enviamos la respuesta y terminamos la ejecución
      } else {
        return res.status(401).send("Acceso denegado"); // Enviamos respuesta de error y detenemos la ejecución
      }
    } catch (error) {
      return res.status(401).send("acceso denegado"); // Enviamos respuesta de error en caso de excepción
    }
  }
};

export const superAdminCheck = async (req: Request, res: Response) => {
  const { admin } = req.params;
  if (admin) {
    let i = 0;
    let access = false;
    while (i < superAdmin.length && !access) {
      if (admin == superAdmin[i]) {
        access = true;
      } else {
        i++;
      }
    }
    if (access) {
      res.json(true);
    } else {
      res.json(false);
    }
  }
};
