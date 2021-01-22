import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";



export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "The User already Exists" });
  }

  const newUser = new User(req.body);
  await newUser.save();
  return res.status(201).json(newUser);
};

export const getUser = async(
  req:Request,
  res:Response
):Promise<Response> =>{
  if(!req.body.code){
    return res.status(400).json({msg:"Please. Send Code from Student"})
  }
  const user = await User.findOne({code:req.body.code })
  if(!user){
    return res.status(400).json({ msg: "The User does not exists" });
  }

  return res.status(200).json(user);
};


export const updateUser = async(
  req:Request,
  res:Response
): Promise<Response> =>{

  if(!req.body.code){
    return res.status(400).json({msg:"Please. Send Code from Student"})
  }  
  const {code} = req.body;
  const  user = await User.findOne({code:req.body.code })
  
  if(!user){
    return res.status(400).json({ msg: "The User does not exists" });
  }

  await User.updateOne({code:code},req.body)

  return res.status(201).json(req.body);
};
export const deleteUser = async(
  req:Request,
  res:Response
): Promise<Response> =>{
  const {code} = req.body;
  if(!req.body.code){
    return res.status(400).json({msg:"Please. Send Code from Student"})
  }
  await User.remove({code: code});

  return res.status(201).json({msg:"Dato eliminado"});
};


export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email and password" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(400).json({ token: "sasdd" });
  }

  return res.status(400).json({
    msg: "The email or password are incorrect"
  });
};
