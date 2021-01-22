import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name:string;
  lastname:string;
  code: string;
  birthdate: Date;
  carreer:string;
  email: string;
  password: string;
};

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  carrerr: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});




export default model<IUser>("User", userSchema);
