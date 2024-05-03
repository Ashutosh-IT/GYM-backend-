import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true 
    },
    password:{ 
        type:String, 
        required:true 
    },
    weight:{ 
        type:Number 
    },
    height:{ 
        type:Number 
    },
    age:{ 
        type:Number 
    },
    gender: { 
        type: String ,
        enum:["Male","Female","Others"]
    },
    bodyType: { 
        type: String ,
        enum:["Lean","Bulky","Muscular"]
    },
    role: { 
        type: String ,
        enum:["Admin","User"],
        default:"User"
    },
});

export const User = mongoose.model("User",UserSchema);