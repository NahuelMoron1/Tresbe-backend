import { Request, Response } from "express";
import Userdata from "../models/mysql/Userdata";

export const getUsersdata = async (req: Request, res: Response) => {    
    const listUsersdata = await Userdata.findAll();
    res.json(listUsersdata);
}

export const getUserdata = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserdataAux = await Userdata.findByPk(id);    
    if(UserdataAux){
        res.json(UserdataAux);
    } else {
        res.status(404).json({message: 'Error, Userdata not found'})
    }
}

export const getUserdataByUserID = async (req: Request, res: Response) => {
    const { userid } = req.params;
    console.log("USER ID: " + userid);
    
    const UserAux = await Userdata.findOne({where: {userID: userid}});    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, Userdata not found'})
    }
}

export const deleteUserdata = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserdataAux = await Userdata.findByPk(`${id}`);
    if(UserdataAux){
        await UserdataAux.destroy();
        res.json({message: 'Userdata successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Userdata not found'})
    }
}

export const postUserdata = async(req: Request, res: Response) => {
    const body = req.body;
    await Userdata.create(body);
    res.json({
        message: 'Userdata successfully created',
    })
}
export const updateUserdata = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const UserdataAux = await Userdata.findByPk(id);
    if(UserdataAux){
        UserdataAux.update(body);
        res.json({
            message: 'Userdata updated with success',
        })
    } else {
        res.status(404).json({message: 'Error, Userdata not found'})
    }
}
export const deleteUsersdata = async (req: Request, res: Response) => {
    await Userdata.destroy({truncate: true});
}