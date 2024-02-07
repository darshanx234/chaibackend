
import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
subscriber:{
    type : mongoose.Schema.Types.ObjectId, // one who is subscribing 
    ref : "user"
}
,
channel:{
    type : mongoose.Schema.Types.ObjectId, // one to whom subscriber is subscribing 
    ref : "user"
}

},{timestamps:true})

export const subscription = mongoose.model("subscription" , subscriptionSchema)