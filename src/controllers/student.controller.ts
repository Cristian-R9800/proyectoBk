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
            .json({ msg: "Please. Send full data for add grade" });
    }

    const user:IUser = await User.findOne({ code: req.params.code }, { subjects: { $elemMatch: { code_subject: req.params.code_subject } } });
    //const user:IUser = await User.findOneAndUpdate({ code: req.params.code ,  subjects: { $elemMatch: { code_subject: req.params.code_subject } } });

    
    user.subjects.forEach(subject => {
        let index = 0;
        subject.grades.forEach(async grade => {
            if(req.body.name == grade.name){
                grade = req.body
                user.subjects[0].grades[index] = grade

                await User.findByIdAndUpdate(grade.id_grade, {subjects: user.subjects})

                return res.status(201).json(user);
            }    
            index++;
        });    
    });
    
    user.subjects[0].grades.push(req.body); 

    await user.save();
    return res.status(201).json(user);
};

export const averageGrade = async (
    req: Request,
    res: Response
): Promise<Response> => {

    console.log("INIT average Grade")

    if (!req.params.code || !req.body.code_subject) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for averageGrade" });
    }

    const user: IUser = await User.findOne({ code: req.params.code }, { subjects: { $elemMatch: { code_subject: req.params.code_subject } } });
    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta" });
    }

    console.log(user.subjects)
    let promedio = 0, size = 0;
    user.subjects.forEach(subject => {
        subject.grades.forEach(grade => {
            console.log(grade.grade_value)
            promedio = promedio + grade.grade_value;
            size++;
        });
    });

    if (size != 0) {
        promedio = promedio / size;
    }

    return res.status(201).json({ average: promedio });
};

export const averageTotal = async (
    req: Request,
    res: Response


): Promise<Response> => {
    console.log("INIT average TOTAL")

    if (!req.params.code) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const user: IUser = await User.findOne({ code: req.params.code }, { subjects: 1, code: 1 });

    let promedio = 0, size = 0;
    user.subjects.forEach(subject => {
        subject.grades.forEach(grade => {
            console.log(grade.grade_value)
            promedio = promedio + grade.grade_value
            size++;
        });
    });

    if (size != 0) {
        promedio = promedio / size;
    }

    return res.status(201).json({ average: promedio });
};

export const getSubjectsByPeriod = async (
    req:Request,
    res:Response
): Promise<Response> =>{
    if (!req.params.code || !req.params.period) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const {code, period} = req.params;
    console.log(`Code [${code}] period [${period}]`)
    let subjects:any = []

    const user: IUser = await User.findOne({ code: code },{ subjects: 1});
    console.log(user)
    user.subjects.forEach(subject => {
        if(period == subject.period){
            subjects.push(subject)
        }
    });

    return res.status(200).json(subjects);
}

export const getGradeBySubjectAndCode = async (
    req:Request,
    res:Response
): Promise<Response> =>{
    if (!req.params.code) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for getGradeBySubjectAndCode" });
    }
    const {code, code_subject, grade_name} = req.params;
    console.log(`Code [${code}] period [${code_subject}]`)

    const user: IUser = await User.findOne({ code: code });
    console.log(`${code_subject}`)
    
    user.subjects.forEach(subject => {
        if(code_subject == subject.code_subject){

            subject.grades.forEach(grade => {
                if(grade.name == grade_name){
                    return res.status(200).json({grade: grade.grade_value});
                }
            });
        }
    });

    return res.status(200).json({grade: "NOT VALUE"});
}

export const averageTotalList = async (
    req: Request,
    res: Response


): Promise<Response> => {
    console.log("INIT average TOTAL List")

    if (!req.params.code) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data" });
    }
    const user: IUser = await User.findOne({ code: req.params.code }, { subjects: 1, code: 1 });

    let listaMaterias: { Materia: string; Promedio: string; }[]=[];
    let name,m;

    let promedio = 0, size = 0;
    user.subjects.forEach(subject => {
        subject.grades.forEach(grade => {
            console.log(grade.grade_value)
            promedio = promedio + grade.grade_value
            size++;
        });
        if (size != 0) {
            promedio = promedio/size;
        }
        
        listaMaterias.push({ "Materia": subject.name, "Promedio": promedio.toFixed(2)})
        promedio = 0
        size = 0
    });

    if (size != 0) {
        promedio = promedio / size;
    }

    return res.status(201).json(listaMaterias);
};





export const averageTotalPeriod = async (
    req: Request,
    res: Response
): Promise<Response> => {
    console.log("INIT average PERIOD")
    const { code, period } = req.params

    console.log(code + " " + period)
    if (!req.params.code) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data NULL" });
    }

    // const user: IUser[] = await User.find({ code: code, subjects: { $elemMatch: { period: period } } });
    const user: IUser[] = await User.find({ code: code, "subjects.period": period }, { _id: 0 });

    console.log(user[0].subjects)



    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta no resultados" });
    }

    let promedio = 0, size = 0;

    user[0].subjects.forEach(subject => {
        if (subject.period.match(period)) {
            subject.grades.forEach(grade => {
                console.log(grade.grade_value)
                promedio += grade.grade_value;
                size++;
            });
        }
    });

    if (size != 0) {
        promedio = promedio / size
    }

    return res.status(201).json({ average: promedio });
};

export const getGradesAverageCourseByPeriod = async (
    req: Request,
    res: Response
): Promise<Response> => {
    console.log("Init getGradesAverageCoursebyPeriod")

    if (!req.params.period) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for subjects" });
    }
    const { period } = req.params;

    const user: IUser[] = await User.find({ subjects: { $elemMatch: { period: period } } });

    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta" });
    }

    let promedio = 0, size = 0;

    user.forEach(use => {
        use.subjects.forEach(subject => {
            if (subject.period.match(period)) {
                subject.grades.forEach(grade => {
                    console.log(grade.grade_value)
                    promedio += grade.grade_value;
                    size++;
                });
            }
        });
    });
    if (size != 0) {
        promedio = promedio / size
    }

    return res.status(201).json({ average: promedio });
};
export const getGradesAverageCourse = async (
    req: Request,
    res: Response
): Promise<Response> => {
    console.log("Init getGradesAverageCourse")

    if (!req.params.code_subject) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for subjects" });
    }
    const { code_subject } = req.params;

    const user: IUser[] = await User.find({ subjects: { $elemMatch: { code_subject: code_subject } } });

    if (!user) {
        return res
            .status(400)
            .json({ msg: "ERROR de consulta" });
    }

    let promedio = 0, size = 0;

    user.forEach(use => {
        use.subjects.forEach(subject => {
            if (subject.code_subject.match(code_subject)) {
                subject.grades.forEach(grade => {
                    console.log(grade.grade_value)
                    promedio += grade.grade_value;
                    size++;
                });
            }
        });
    });
    if (size != 0) {
        promedio = promedio / size
    }

    return res.status(201).json({ average: promedio });
};



export const getGradesSubjectsbyCode = async (
    req: Request,
    res: Response
): Promise<Response> => {


    if (!req.params.code || !req.params.code_subject) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for subjects" });
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




export const addSubject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (validateRequestSubject(req).match("ERROR")) {
        return res
            .status(400)
            .json({ msg: "Please. Send full data for add data" });
    }

    

    const user = await User.findOne({ code: req.params.code });


    
    const users: IUser[] = await User.find({id_rol: "2"});

    let isValidToUpload = true;
    users.forEach(user => {
        if(req.params.code != user.code){
            user.subjects.forEach(subject => {
                if(subject.name == req.body.name){
                    isValidToUpload = false;
                }
            });
        }
    });

    if(isValidToUpload){
        user.subjects.push(req.body);
        await user.save();
        console.log("Materia incluida correctamente")
        return res.status(200).json({ msg: "Materia incluida correctamente" });
    }
    else{
        console.log("Materia NO incluida")
        return res.status(400).json({ msg: "Materia ya asignada previamente" });
    }


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