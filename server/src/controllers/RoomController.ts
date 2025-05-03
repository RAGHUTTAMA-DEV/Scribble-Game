import { Request, Response } from 'express';
import Room from '../models/RoomModel';
import GameModel from '../models/GameModel';
export async function createRoom(req:Request,res:Response){
     try{
        const {roomName,settings}=req.body;
        const user=await GameModel.findOne({roomName});
         const GameId=user?._id;
        await Room.create({
         roomName,settings,
        })
        //socket call


     }catch(error){
        console.error("Internal serer issuse")
     }
}

export async function joinRoom(req:Request,res:Response){

}

export async function leaveRoom(req:Request,res:Response){

}

export async function startGame(req:Request,res:Response){
   try{
     

   }catch(error:any){
         console.log("Error internal issuse",error);
         res.status(500).json({message:"Internal server error"});
   }
}

