import { model, Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  code: string;
  name: string;
  lastname: string;
  birthdate: Date;
  degree: string;
  email: string;
  password: string;
  id_rol: string;
  image_location: string;
  location: {
    latitud: number;
    longitud: number;
  };
  subjects: [
    {
      code_subject: string;
      name: string;
      period: string;
      active: boolean;
      grades: [
        {
          id_grade: string;
          name: string;
          grade_value: number;
          date: Date;
        }
      ]
    }
  ]

};

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: false },
  degree: { type: String, required: true },
  password: { type: String, required: true },
  id_rol: { type: Number, required: true },
  image_location: {type: String, required: true},
  location: {
    latitud: Number,
    longitud: Number
  },
  subjects: [{

    code_subject: String,
    name: String,
    period: String,
    active: Boolean,
    grades: [
      {
        id_grade: String,
        name: String,
        grade_value: Number,
        date: Date,
      }
    ]
  }]

});




export default model<IUser>("User", userSchema);
