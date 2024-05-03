import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String, 
        unique:true
    },
    otp:{ 
        type:String,  
    },
    flag:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        expires: '5m',
        default:Date.now
    }
});

export const OTP = mongoose.model("OTP",otpSchema);