import User, { IUser } from "../models/user";
import { sendEmail } from "../services/notification.services";

interface location {
  latitud: number,
  longitud: number
}

export const updateLocation = async (
  code: string,
  latitud: string,
  longitud: string
): Promise<String> => {
  console.log("init update location");

  const newLocation: location = {
    latitud: +latitud,
    longitud: +longitud
  }

  const user = await User.findOne({ code: code });

  if((verifyLocationRisk(user, newLocation))){
    user.location = newLocation;
    await user.save();
    return "SUCCESS";
  } else{
    return "BLOCKED";
  }

};

function verifyLocationRisk(user: IUser, newlocation: location):boolean {
  let data = JSON.stringify(user)
  let dataJson = JSON.parse(data);

  if (Math.abs(user.location.latitud - newlocation.latitud) > 1
    || Math.abs(user.location.longitud - newlocation.longitud) > 1) {
    const htmlbody = `
      <h1> USER ${user.name} IN RISK actual login location is </h1> 
      <ul>
        <li>latitud: ${newlocation.latitud}</li>
        <li>longitud: ${newlocation.longitud}</li>
      </ul>      
      `;
    sendEmail(user.email, htmlbody);
    return false;

  }else{
    return true;
  }

}
