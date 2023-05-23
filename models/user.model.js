import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    password: {type:String, required:true},
    // imageUrl: {type:String},
    id:{ type:String}
});

const postMessage = mongoose.model('users',userSchema);

export default postMessage;