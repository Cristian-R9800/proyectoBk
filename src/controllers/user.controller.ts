import { Request, Response } from "express";
import { updateLocation } from "../services/geolocation.services";
import User, { IUser } from "../models/user";
import { sendEmail } from "../services/notification.services";
import { Stream } from "stream";
import config from '../config/config';
import msRest from "@azure/ms-rest-js";
import Face from "@azure/cognitiveservices-face";
import { BlobServiceClient } from '@azure/storage-blob';
const uuid = require("uuid/v4");
import azureStorage from 'azure-storage';
import { AnonymousCredentialPolicy } from "@azure/storage-blob";
import axios, { AxiosResponse } from "axios";
const blobService = azureStorage.createBlobService(config.AZURE_CONECTION_STORAGE_KEY);
const containerName = 'datasetfaces';
//import getStream from 'into-stream';


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

const getBlobName = (originalName: any) => {
  const identifier = new Date().getTime();
  return `${identifier}-${originalName}.png`
}





export const saveImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  
  console.log(req.body)
  const blobName = getBlobName(req.body.email);
  //const streamRaw =  await fetch(req.body.image);
  //const stream =  getStream(req.body.image);
  const streamLengh = req.body.image.length;

  const blobServiceClient = BlobServiceClient.fromConnectionString(config.AZURE_CONECTION_STORAGE_KEY);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  

  var imgData = req.body.image;
  var base64Data = imgData.replace(/^data:image\/png;base64,/, "");


  require("fs").writeFile("face.png", base64Data, 'base64',
    function (err: any, data: any) {
      if (err) {
        console.log('err', err);
      }
      console.log('success');

    });
  const blobOptions = { blobHTTPHeaders: { blobContentType: 'image/png' } };
  const uploadBlobResponse = await blockBlobClient.uploadFile("face.png", req.body.image.length);
  console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
  checkFaces(req);
  return res.status(200).json(blobService);
};



export const viewImages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  
  console.log(req.body)
  const blobName = getBlobName(req.body.email);
  //const stream = getStream(req.body.image.buffer);
  const streamLengh = req.body.file.buffer.length;

  //const containerClient = blobService.getContainerAcl(containerName);
  blobService.createBlockBlobFromStream(containerName,blobName,req.body.image, streamLengh, (err: any) =>{
    if(err){
      console.log(err)
    }
  });
  return res.status(200).json(blobService);
};




export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.code) {
    return res.status(400).json({ msg: "Please. Send Code from Student" })
  }
  const user = await User.findOne({ code: req.body.code })
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  return res.status(200).json(user);
};


export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {

  if (!req.body.code) {
    return res.status(400).json({ msg: "Please. Send Code from Student" })
  }
  const { code } = req.body;
  const user = await User.findOne({ code: req.body.code })

  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  await User.updateOne({ code: code }, req.body)

  return res.status(201).json(req.body);
};
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code } = req.body;
  if (!req.body.code) {
    return res.status(400).json({ msg: "Please. Send Code from Student" })
  }
  await User.deleteOne({ code: code });

  return res.status(201).json({ msg: "Dato eliminado" });
};

export const getUserSubjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code } = req.params;
  if (!req.params.code) {
    return res.status(400).json({ msg: "Please. Send Code from Student" })
  }

  const user = await User.findOne({ code: code }, { subjects: 1 });

  return res.status(200).json(user.subjects);
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

  const user = await User.findOne({ email: req.body.email }, { subjects: 0, location: 0 });
  if (!user) {
    return res.status(503).json({ msg: "The User does not exists" });
  }

  if (user.email != req.body.email || user.password != req.body.password) {
    return res.status(400).json({ msg: "ERROR PASSWORD OR EMAIL INVALID" });
  }

  if (!req.body.latitud || !req.body.longitud) {
    return res
      .status(400)
      .json({ msg: "Please. Send your full location" });
  }

  //const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': config.KEY_FACE_API } });
  //const client = new Face.FaceClient(credentials, config.ENDPOINT_FACE_API);

  const stateBlocked: String = await updateLocation(user.code, req.body.latitud, req.body.longitud)
  //const checkFacesResponse = checkFaces(user.image_location)




  if (stateBlocked == "BLOCKED" /*|| "OK" == await checkFaces(req)*/) {
    return res.status(400).json({ msg: "LOGIN BLOCKED" })
  }
  else {
    return res.status(200).json(user);
  }



};

const checkFaces = async (request: Request): Promise<string> => {
  

  const urlImage = `https://imagesface.blob.core.windows.net/datasetfaces/image5.jpeg`
  const detect1 = await postData(config.URL_FACE_API+"detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400",
    {
      url: urlImage
    }).then((response) =>{
      const  dato  = response as unknown as string;
      console.log(response)
      
    }).catch(err =>{
      console.log(err)
    })
    console.log(detect1)
  



  // blobService.listBlobsSegmented(containerName, <any>null ,(err,data)=>{
  //   if(err){
  //     console.log(err)
  //     return;
  //   }else{
      
  //     if(data.entries.length){
  //       data.entries.forEach(async element => {
          
       
  //       })
  //     }
  //   }
  // })
 return "OK";
};

async function postData(url:string, data:any) {
  // Opciones por defecto estan marcadas con un *
  console.log( JSON.stringify(data))

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': config.KEY_FACE_API
    }
  };

  const response = await axios.post(url, {
    url: data.url 
  }, options).catch((err) => {
    console.log(err.response);
  });


  return JSON.stringify(response); // parses JSON response into native JavaScript objects
}


export const verify = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code } = req.params;
  if (!req.params.code) {
    return res.status(400).json({ msg: "Please. Send Code from Student" })
  }

  const user = await User.findOne({ code: code }, { subjects: 1 });

  return res.status(200).json(user.subjects);
};

export const sendSupport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { message,subject, email } = req.body;
  if (!message || !subject || !email) {
    return res.status(400).json({ msg: "Please. Send full data" })
  }

  await sendEmail(email, message, subject).catch(
    () => {
      return res.status(200).json({ msg: "Error en el envio del correo" });
    }
  );

  return res.status(200).json({ msg: "Enviado correctamente" });
};

