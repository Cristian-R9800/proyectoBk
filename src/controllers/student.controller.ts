import { Request, Response } from "express";
import { updateLocation } from "../services/geolocation.services";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";



export const putGrade = async (
    req: Request,
    res: Response
): Promise<Response> => {


    if (validateRequest(req).match("ERROR")) {
        return res
        .status(400)
        .json({ msg: "Please. Send full data" });
    }

    const user = await User.findOne({ email: req.body.code });

    
    return res.status(201).json(user);
};



const validateRequest = (request: Request): string => {

    if (!request.body 
        || !request.body.code
        || !request.body.code_subject
        || !request.body.name
        || !request.body.period
        || !request.body.active
        || !request.body.grades)
        return "ERROR";
    return "SUCCESS";
};