import { Request, Response, Router } from "express";
import Users from "../models/mysql/Users";
import bcrypt from 'bcrypt';
import { User } from "../models/User";
import { PublicUser } from "../models/PublicUser";
import { admin } from "../models/config";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
export const getUsers = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { email } = req.params;
            if (email != admin) {
                const listUsers = await Users.findAll();
                let users: PublicUser[] = [];
                if (listUsers) {
                    users = listUsers.map(user => user.toJSON() as PublicUser);
                }
                res.json(users);
            } else if (email == admin) {
                const listUsers = await Users.scope('withAll').findAll();
                let users: User[] = [];
                if (listUsers) {
                    users = listUsers.map(user => user.toJSON() as User);
                }
                res.json(users);
            } else {
                res.status(501).json({ message: "Bad Request for users" });
            }
        } else {
            res.send('Ruta protegid');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getUser = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.access_token;
    let user: PublicUser = new PublicUser('', '', '', '', '');
    if (tokenAux) {
        let userAux = await getToken(tokenAux);
        if (userAux) {
            user = userAux;
        }
        const { id } = req.params;
        if (user.email === admin) {
            const UserAux = await Users.scope('withAll').findByPk(id);
            if (UserAux) {
                res.json(UserAux);
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            if (user.id === id) {
                const UserAux = await Users.scope('withAll').findByPk(id);
                if (UserAux) {
                    res.json(UserAux);
                } else {
                    res.status(404).json({ message: 'Error, User not found' })
                }
            }
        }
    } else {
        res.send('Ruta protegida');
    }
}

async function getToken(tokenAux: any) {
    let user: PublicUser = new PublicUser('', '', '', '', '');
    try {
        const data = jwt.verify(tokenAux, SECRET_JWT_KEY);
        if (typeof data === 'object' && data !== null) {
            user = data as PublicUser; // Casting si estás seguro que data contiene propiedades de User
            return user;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const getUserByEmail = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { email } = req.params;
            const UserAux = await Users.scope('withAll').findOne({ where: { email: email } });
            if (UserAux) {
                res.json(UserAux);
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAux = await loginCheck(email, password);
    let userValidated: User = new User('', '', '', '', false, '', '');
    if (userAux != null) {
        userValidated = userAux;
        const access_token = jwt.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client }, SECRET_JWT_KEY, {
            expiresIn: "1h"
        });

        const refresh_token = jwt.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client }, SECRET_JWT_KEY, {
            expiresIn: "1d"
        });

        res.cookie('access_token', access_token, {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            ///domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 1000 * 60 * 60
        });

        res.cookie('refresh_token', refresh_token, {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            ///domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 1000 * 60 * 60 * 24
        });

        if (userValidated.email == admin) {
            const admin_token = jwt.sign({ id: userValidated.id, email: userValidated.email, username: userValidated.username, priceList: userValidated.priceList, client: userValidated.client }, SECRET_JWT_KEY, {
                expiresIn: "1h"
            });
            res.cookie('admin_token', admin_token, {
                path: '/',
                httpOnly: true,
                secure: true,///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                sameSite: 'none',
                domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                maxAge: 1000 * 60 * 60
            });
            res.send({ userValidated, access_token, admin_token });
        } else {
            res.send({ userValidated, access_token });
        }
    } else {
        res.status(404).json({ message: 'Error al iniciar sesion' });
    }
}

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.access_token;

    if (token) {
        const admin = req.cookies.admin_token;
        res.cookie('refresh_token', '', {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            ///domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 0
        });

        res.cookie('access_token', '', {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            ///domain: '.somostresbe.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
            maxAge: 0
        });

        if (admin) {
            res.cookie('admin_token', '', {
                path: '/',
                httpOnly: true,
                secure: true,///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                domain: '.tresbedistribuidora.com', // Comparte la cookie entre www.somostresbe.com y api.somostresbe.com
                sameSite: 'none',
                maxAge: 0
            });
        }
        res.send('finish');
    }
}

async function loginCheck(email: string, password: string) {
    const user = await Users.scope('withAll').findOne({ where: { email: email } });
    let userAux: User = new User('', '', '', '', false, '', '');
    if (user != null) {
        userAux = user.toJSON() as User;
        let access = await bcrypt.compare(password, userAux.password);
        if (access) {
            return userAux;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export const getUsersBySeller = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { seller } = req.params;
            const UserAux = await Users.findAll({ where: { seller: seller } });
            if (UserAux) {
                res.json(UserAux);
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const getUserByName = async (req: Request, res: Response) => {
    let access = req.cookies['access_token'];
    let tokenAux = req.cookies['admin_token'];
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { username } = req.params;
            const UserAux = await Users.findOne({ where: { username: username } });
            if (UserAux) {
                res.json(UserAux);
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            const { id } = req.params;
            const UserAux = await Users.findByPk(`${id}`);
            if (UserAux) {
                await UserAux.destroy();
                res.json({ message: 'User successfully deleted' });
            } else {
                res.status(404).json({ message: 'Error, User not found' })
            }
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const postUser = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            let { id, email, username, priceList, client, seller, password } = req.body;
            let hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                id,
                email,
                username,
                priceList,
                client,
                seller,
                password: hashedPassword  // Guardar la contraseña hasheada
            };
            await Users.create(user);
            res.json({
                message: `User successfully created with hashed password: ${user}`,
            });
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const updateUser = async (req: Request, res: Response) => {
    /*let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;*/
    const body = req.body;
    const { id } = req.params;
    const UserAux = await Users.findByPk(id);
    if (UserAux) {
        UserAux.update(body);
        res.json({
            message: 'User updated',
        })
    } else {
        res.status(404).json({ message: 'Error, User not found' })
    }

}

const verifyAdmin = (adminToken: any) => {
    const dataAdmin = jwt.verify(adminToken, SECRET_JWT_KEY);
    if (typeof dataAdmin === 'object' && dataAdmin !== null) {
        const userAux: PublicUser = dataAdmin as PublicUser;
        if (userAux.email == admin) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        const body = req.body;
        const { id } = req.params;
        const UserAux = await Users.findByPk(id);
        if (UserAux) {
            body.password = await bcrypt.hash(body.password, 10);
            UserAux.update(body);
            res.json({
                message: 'User updated',
            })
        } else {
            res.status(404).json({ message: 'Error, User not found' })
        }
    } else {
        res.send('Ruta protegida');
    }
}
export const deleteUsers = async (req: Request, res: Response) => {
    let tokenAux = req.cookies.admin_token;
    let access = req.cookies.access_token;
    if (access && tokenAux) {
        if (verifyAdmin(tokenAux)) {
            await Users.destroy({ truncate: true });
        } else {
            res.send('Ruta protegida');
        }
    } else {
        res.send('Ruta protegida');
    }
}