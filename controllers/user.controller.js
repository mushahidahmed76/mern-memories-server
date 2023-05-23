import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import User from "../models/user.model.js";


export const signIn = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser){ res.status(404).json({ message: "User doesn't exists." }); }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect){ res.status(400).json({ message: "Invalid credentials" }); }
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'test',{expiresIn:"10h"});
        res.status(200).json({result:existingUser,token}) 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const signUp = async (req,res)=>{
    
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){ res.status(400).json({ message: "User already exists." }); return; }
        if(password !== confirmPassword) {res.status(400).json({ message: "Passwords not matched" }); return;}
        const hashedPassword = await bcrypt.hash(password,12);
        const userData = {email,password:hashedPassword,name:`${firstName} ${lastName}`};
        const result = await User.create(userData);
        const token = jwt.sign({email:email,id:result._id},'test',{expiresIn:"10h"});
        res.status(200).json({result,token});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

