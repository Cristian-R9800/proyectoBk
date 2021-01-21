import mongoose, {Schema, Document} from 'mongoose'

export interface ITest extends Document {
    firstName: string;
}


const TestSchema: Schema = new Schema({
    firstName: {type:String, required : true}
});
export default mongoose.model<ITest>('User', TestSchema)

