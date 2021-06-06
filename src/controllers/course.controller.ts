import { Request, Response } from "express";
import { updateLocation } from "../services/geolocation.services";
import User, { IUser } from "../models/user";

export const getSubjectStudents = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { code_subject } = req.params;
    if (!req.params.code_subject) {
        return res.status(400).json({ msg: "Please. Send Code from Student" })
    }

    const user = await User.find({ subjects: { $elemMatch: { code_subject: code_subject } } }, { subjects: 0 })
    console.log(user)
    if (!user) {
        return res
            .status(400)
            .json({ msg: "Data not found" });
    }

    return res.status(200).json(user);
};

export const getTeachers = async (
    req: Request,
    res: Response
): Promise<Response> => {

    const users: IUser[] = await User.find({ id_rol: "2" });
    return res.status(200).json(users)
};

export const getSubjectsByCode = async (
    req: Request,
    res: Response
): Promise<Response> => {

    if (!req.params.code) {
        return res.status(400).json({ msg: "Please. Send Code from Student" })
    }
    const { code } = req.params;

    const users: IUser = await User.findOne({ code: code });

    return res.status(200).json(users.subjects)
};