import nodemailer from "nodemailer";
import {User} from "../user/userModel.js";
import bcrypt from "bcryptjs";
import {OTP} from "./otpModel.js"

export const getOTP = async(req,res) => {
    try{
        const {email} = req.body;
        if(!email) {
            return res.status(403).send("Enter Valid Email");
        }

        const transporter = nodemailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(403).send("Account with this email Not Found");
        }

        const otpexists = await OTP.findOne({ email });
        if(otpexists){
            return res.status(403).send("OTP already sent");
        }

        let otp = Math.floor(100000 + Math.random() * 900000);
        otp = otp.toString();

        await OTP.create({ email,otp });

        const mailOptions = {
            from: {
                name:"Ashutosh Kumar",
                address:process.env.USER_EMAIL
            },
            to: email, // list of receivers
            subject: "Password Reset OTP", // Subject line               
            html: `<h1>OTP is ${otp}</h1>`, // html body
        }

        const sendMail = async(transporter,mailOptions) => {
            try{
                await transporter.sendMail(mailOptions);
                console.log("message sent successfilly");
            }
            catch(error){
                console.log(error);
            }
        }

        sendMail(transporter,mailOptions);

        return res.status(200).json({
            message:"otp sent successfully",
            success:true
        });
    }
    catch(error){
        console.log(error);
        return res.status(403).send("otp cannot be send");
    }
}

export const verifyotp = async (req,res) => {
    try{
        let {email,otp} = req.body;
        if(!otp){
            return res.status(404).send("please enter otp");
        }

        const otpexists = await OTP.findOne({ email });
        if(!otpexists){
            return res.status(403).send("otp expires");
        }

        const match = otp.toString() === otpexists.otp;
        if(!match){
            return res.status(403).send("enter valid otp");
        }

        await OTP.findOneAndUpdate({email},{flag:true});

        return res.status(200).json({
            message:"otp verified successfully",
            success:true
        });
    }
    catch(error){
        console.log(error);
    }
}

export const resetPassword = async(req,res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(403).send("Enter credentails");
        }
        const otp = await OTP.findOne({email});
        if(!otp){
            return res.status(403).send("session expired!");
        }

        if(!otp.flag){
            return res.status(403).send("un-authorized");
        }

        await OTP.findOneAndDelete({email});

        const hash = await bcrypt.hash(password, 10);
        const data = await User.findOneAndUpdate(
            { email },
            { password: hash }
        );
        
        return res.status(201).send(data);
    }
    catch(error){
        console.log(error);
        return res.status(403).send("password reset failed");
    }
}

