import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Jwt_Secret } from './config/db';
export default async function auth(req:Request,res:Response,next:NextFunction){
    const token=req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
     await jwt.verify(token,Jwt_Secret as string,(err:any,decoded:any)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.body.user=decoded;
        next();
    });


}