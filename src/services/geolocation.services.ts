import User, { IUser } from "../models/user";

export const updateLocation = async (
    code:string,
    latitud:string,
    longitud:string
  ): Promise<String> => {
    console.log("init update location");

    
    const newLocation = {
        latitud : latitud,
        longitud: longitud
    }

    const user = await User.findOne({ code: code });
    user.location = newLocation;

    await user.save();


    return "Code "+code+" location updated successfully";
  };