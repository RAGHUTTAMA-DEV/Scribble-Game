import { Request, Response } from 'express';
export async function createRoom(req:Request,res:Response){
     try{
        const 

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

