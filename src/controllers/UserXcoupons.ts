import { Request, Response } from "express";
import UserXcoupon from "../models/mysql/UserXcoupon";

export const getUserXcoupon = async (req: Request, res: Response) => {
    const { userID, couponID } = req.params;
    const UserAux = await UserXcoupon.findOne({where: {userID: userID} && {couponID: couponID}});    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
    
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserAux = await UserXcoupon.findByPk(`${id}`);
    if(UserAux){
        await UserAux.destroy();
        res.json({message: 'User successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const postUser = async(req: Request, res: Response) => {
    const body = req.body;
    
    await UserXcoupon.create(body);
    res.json({
        message: 'User successfully created',
    })
}
export const updateUser = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const UserAux = await UserXcoupon.findByPk(id);
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
    await UserXcoupon.destroy({truncate: true});
}