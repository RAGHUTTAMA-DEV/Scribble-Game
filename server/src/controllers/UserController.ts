import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
export async function SignUp(req:Request,res:Response){
     try{
        const {username,password,email}=req.body;
        const doesExist=await UserModel.findOne({
            $or:[
                {username},
                {email}
            ]})
        if(doesExist){
            return res.status(400).json({message:"User already exists"});
        }else{
          const user=  await UserModel.create({
                username,
                password,
                email
            });
            return res.status(201).json({user,message:"User created successfully"});
        }

     }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
     }


}

export async function SignIn(req:Request,res:Response){
     try{
        const {username,password}=req.body;
        const user=await UserModel.findOne({username});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isCorrect=await user.comparePassword(password);
        if(!isCorrect){
            return res.status(400).json({message:"Incorrect password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET as string,{expiresIn:"1d"});
        return res.status(200).json({token,message:"User logged in successfully"});


     }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
     }
}

export async function UpdateUser(req:Request,res:Response){
      try{
        const {username,password,email,bio,avatar,}=req.body;
        
      
      }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
      }
}

export function DeleteUser(){

}

export function GetUser(){

}