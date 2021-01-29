import config from '../config/config';
import { Transporter, createTransport } from "nodemailer";
export const sendEmail = async (
    mail: string,
    body: string,
    subject: string
): Promise<string> => {

    const { MAILUSER, MAILPSSWD } = config

    const mailOptions = {
        from: MAILUSER,
        to: mail,
        subject: subject,
        html: body,
    }
    console.log(MAILUSER + " " + MAILPSSWD+ " "+ mail+ " " + body )

    let transporter = createTransport(
        `smtps://servicio.correos.proyectonotas@gmail.com:${MAILPSSWD}@smtp.gmail.com`
    );
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }
        console.log(`Message Send to ${info.response}`)
    })
    return "";
};


