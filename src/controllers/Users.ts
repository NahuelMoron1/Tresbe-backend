import { Request, Response } from "express";
import Users from "../models/mysql/Users";
import bcrypt from 'bcrypt';
import { User } from "../models/User";
import { PublicUser } from "../models/PublicUser";
import { admin } from "../models/config";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../models/config";
export const getUsers = async (req: Request, res: Response) => {
    const { email } = req.params;
    if(email != admin){
        const listUsers = await Users.findAll();
        let users: PublicUser[] = [];
        if(listUsers){
            users = listUsers.map(user => user.toJSON() as PublicUser);
        }
        res.json(users);
    }else if(email == admin){
        const listUsers = await Users.scope('withAll').findAll();
        let users: User[] = [];
        if(listUsers){
            users = listUsers.map(user => user.toJSON() as User);
        }
        res.json(users);
    }else{
        res.status(501).json({message: "Bad Request for users"});
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id, email } = req.params;
    if(email != admin){
        const UserAux = await Users.findByPk(id);    
        if(UserAux){
            res.json(UserAux);
        } else {
            res.status(404).json({message: 'Error, User not found'})
        }
    }else{
        const UserAux = await Users.scope('withAll').findByPk(id);    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
    }
}

export const getUserByEmail = async (req: Request, res: Response) => {
    const { email, loggedEmail } = req.params;
    if(loggedEmail != admin){
        const UserAux = await Users.scope('withAll').findOne({where: {email: email}});   
        if(UserAux){
            res.json(UserAux);
        } else {
            res.status(404).json({message: 'Error, User not found'})
        }
    }else{
        const UserAux = await Users.scope('withAll').findOne({where: {email: email}});    
        if(UserAux){
            res.json(UserAux);
        } else {
            res.status(404).json({message: 'Error, User not found'})
        }
    }
}
export const temporalLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAux = await loginCheck(email, password);
    let userValidated: User = new User('','','','',false,'','');
    if(userAux != null){
        userValidated = userAux;
        res.json(userValidated);
    }else{
        res.status(404).json({message: 'Error al iniciar sesion'});
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAux = await loginCheck(email, password);
    let userValidated: User = new User('','','','',false,'','');
    if(userAux != null){
        userValidated = userAux;
        const access_token = jwt.sign({ id: userValidated.id, email: userValidated.email, priceList: userValidated.priceList, username: userValidated.username, client: userValidated.client }, SECRET_JWT_KEY, {
            expiresIn: "1h"
        });

        res.cookie('access_token', access_token, {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            maxAge: 1000 * 60 * 60
        });

        if(userValidated.email == admin){
            const admin_token = jwt.sign({ id: userValidated.id, email: userValidated.email, username: userValidated.username, priceList: userValidated.priceList, client: userValidated.client}, SECRET_JWT_KEY, {
                expiresIn: "1h"
            });
            res.cookie('admin_token', admin_token, {
                path: '/',
                httpOnly: true,
                secure: true,///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                sameSite: 'none',
                maxAge: 1000 * 60 * 60
            });
            res.send({userValidated, access_token, admin_token});
        }else{
            res.send({userValidated, access_token});
        }
    }else{
        res.status(404).json({message: 'Error al iniciar sesion'});
    }
}

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.access_token;
    
    if(token){
        const admin = req.cookies.admin_token;
        res.cookie('access_token', '', {
            path: '/',
            httpOnly: true,
            secure: true,///process.env.NODE_ENV == 'production',
            sameSite: 'none',
            maxAge: 0
        });
        if(admin){
            res.cookie('admin_token', '', {
                path: '/',
                httpOnly: true,
                secure: true,///process.env.NODE_ENV == 'production', FALSE EN HTTP, TRUE EN HTTPS
                sameSite: 'none',
                maxAge: 0
            });
        }
        res.send('finish');
    }
}

async function loginCheck(email: string, password: string){
    const user = await Users.scope('withAll').findOne({where: {email: email}});
    let userAux: User = new User('','','','',false,'','');
    if(user != null){
        userAux = user.toJSON() as User;
        let access = await bcrypt.compare(password, userAux.password);
        if(access){
            return userAux;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

export const getUsersBySeller = async (req: Request, res: Response) => {
    const { seller } = req.params;
    const UserAux = await Users.findAll({where: {seller: seller}});    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
}

export const getUserByName = async (req: Request, res: Response) => {
    const { username } = req.params;
    const UserAux = await Users.findOne({where: {username: username}});    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserAux = await Users.findByPk(`${id}`);
    if(UserAux){
        await UserAux.destroy();
        res.json({message: 'User successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const postUser = async(req: Request, res: Response) => {
    let {id, email, username, priceList, client, seller, password} = req.body;
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
    })
}
export const updateUser = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    body.password = await bcrypt.hash(body.password, 10);
    const UserAux = await Users.findByPk(id);
    if(UserAux){
        UserAux.update(body);
        res.json({
            message: 'User updated',
        })
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const deleteUsers = async (req: Request, res: Response) => {
    await Users.destroy({truncate: true});
}