import { json, Request, Response } from "express";
import { updateLocation } from "../services/geolocation.services";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";



export const addGrade = async (
    req: Request,
    res: Response
): Promise<Response> => {


    if (validateRequestGrade(req).match("ERROR")) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }

    const user = await User.findOne({ code: req.params.code }, { subjects: { $elemMatch: { code_subject: req.params.code_subject } } });

    user.subjects[0].grades.push(req.body);

    await user.save();
    return res.status(201).json(user);
};

export const averageGrade = async (
    req: Request,
    res: Response
): Promise<Response> => {


    if (!req.params.code || !req.body.code_subject) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }

    const user = await User.findOne({ code: req.params.code }, { subjects: { $elemMatch: { code_subject: req.params.code_subject } } });
    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta" });
    }
    let result = averageSubject(user.subjects[0].grades);
    return res.status(201).json({ average: result });
};

export const averageTotal = async (
    req: Request,
    res: Response


): Promise<Response> => {

    if (!req.params.code) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const user = await User.findOne({ code: req.params.code }, { subjects: 1, code: 1 });


    let result = avgTotal(user.subjects, user.code);
    return res.status(201).json({ average: result });
};

const avgTotal = async (subjects: string, code: string): Promise<number> => {
    let data = JSON.stringify(subjects)
    let dataJson = JSON.parse(data);
    let average = 0, size = 0;

    await dataJson.forEach(async (element: { code_subject: string; }) => {

        const user = await User.find({ code: code }, { subjects: { $elemMatch: { code_subject: element.code_subject } } });
        console.log(user)
        let result = averageSubject(user.subjects[0].grades);

        average += result;
        size += 1;
        if (dataJson.size == size) {
            console.log("El numero es " + result);
            return average / size;
        }
    });

    console.log("dd" + average)
    return 0;
}

export const getGradesSubjectsbyCode = async (
    req: Request,
    res: Response
): Promise<Response> => {
    

    if (!req.params.code || !req.params.code_subject) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const { code, code_subject } = req.params;

    const user = await User.findOne({ code: code }, { subjects: { $elemMatch: { code_subject: code_subject } } });

    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta" });
    }
    console.log(user.subjects)

    return res.status(201).json(user.subjects[0].grades);
};

const averageSubject = (grades: string): number => {
    let data = JSON.stringify(grades)
    let dataJson = JSON.parse(data);
    let average = 0, size = 0;

    dataJson.forEach((element: { grade_value: number; }) => {
        average += element.grade_value
        size += 1;
    });

    return average / size;
};





export const addSubject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (validateRequestSubject(req).match("ERROR")) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const user = await User.findOne({ code: req.params.code });

    user.subjects.push(req.body);


    await user.save();
    return res.status(201).json({ msg: "Materia incluida correctamente" });
};

export const getAverageByPeriod = async (
    req: Request,
    res: Response
): Promise<Response> => {
    
    const {code, period} = req.params;

    if (!req.params.code || !req.params.code_subject) {
            return res
                .status(400)
                .json({ msg: "Please. Send full data" });
    }

    const user = await User.find({ code: code }, { subjects: { $elemMatch: { period: period } } });


    if (!user) {
        return res
        .status(400)
        .json({ msg: "Dato no encontrado" });
    }




    return res.status(201).json({ msg: "Materia incluida correctamente" });
};





const validateRequestSubject = (request: Request): string => {

    if (!request.body
        || !request.params.code
        || !request.body.code_subject
        || !request.body.name
        || !request.body.period
        || !request.body.active
        || !request.body.grades)
        return "ERROR";
    return "SUCCESS";
};





const validateRequestGrade = (request: Request): string => {

    if (!request.body
        || !request.params.code
        || !request.params.code_subject
        || !request.body.id_grade
        || !request.body.name
        || !request.body.grade_value
        || !request.body.date
    ) {
        return "ERROR";
    }

    return "SUCCESS";
};