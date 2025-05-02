import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Jwt_Secret } from "../config/db";

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
        console.log(req.body);
        const user=await UserModel.findOne({username});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isCorrect=await user.comparePassword(password);
        if(!isCorrect){
            return res.status(400).json({message:"Incorrect password"});
        }
        const token=jwt.sign({username:user.username},Jwt_Secret as string,{expiresIn:"1h"});
        return res.status(200).json({token,message:"User logged in successfully"});


     }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
     }
}

export async function UpdateUser(req:Request,res:Response){
      try{
        const updatedata=req.body;
        const username=req.params.username as string;

        const user=await UserModel.findOne({username});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const updatedUser=await UserModel.findOneAndUpdate(
            { username },
            { $set: { ...updatedata } },
            { new: true }
        );
        
        return res.status(200).json({updatedUser,message:"User updated successfully"});
      
      }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
      }
}

export async function DeleteUser(req:Request,res:Response){
    try{
        const username=req.params.username as string
        const user=await UserModel.findOneAndDelete({username});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        return res.status(200).json({message:"User deleted successfully"});

    }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function GetUser(req:Request,res:Response){
    try{
        const username=req.params.username as string
        const isuser=await UserModel.findOne({username});
        if(!isuser){
            return res.status(400).json({message:"User not found"});
        }
        const user=await UserModel.findOne({username}).select("-password -__v -createdAt -updatedAt");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.status(200).json({user,message:"User fetched successfully"});


 
    }catch(error:any){
        console.log("Error internal issuse",error);
        res.status(500).json({message:"Internal server error"});
    }
}