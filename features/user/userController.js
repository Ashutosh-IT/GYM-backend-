import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "./userModel.js";
import {CartModel} from "../cart/cartModel.js"
import nodemailer from "nodemailer";


export const allUsers = async (req, res) => {
    try {
      let data = await User.find();
      return res.status(200).send(data);
    } 
    catch (error) {
      return res.status(404).send(error.message);
    }
};

export const getUser = async (req, res) => {

    try{
        if(req.params.email){
            let data = await User.findOne({email:req.params.email});
            if(!data){
                return res.status(404).send("No user exists with this email");
            }
            return res.status(200).send(data);
        }
        return res.status(404).send("Enter email");
    }
    catch(error){
        return res.status(404).send(error.message);
    }
};
  

// Login Route
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).send("Enter Credianteials");
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).send("User Not Found");
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(400).send("incorrect username or password");
        }

        const tokenData = {
            _id: user.id,
            name: user.username,
            role: user.role,
            email:user.email,
            password: user.password,
        };
        
        const token = await jwt.sign(tokenData,process.env.SECRET_TOKEN,{expiresIn:"1d"});

        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000}).send({ message: "Login success", token, email });

    }
    catch(error){
        console.log(error);
    }
 };

 // Signup Route
export const register = async (req, res) => {
    try{
        const {
            email,
            firstName, lastName,
            password,
            weight,
            height,
            age,
            role,
            gender,
            bodyType,
          } = req.body;

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
        
        let username = firstName +" "+lastName
        if (!email || !password || !username) {
            return res.status(403).json({
                message:"All fields are required",
            });
        }

        const exist = await User.findOne({ email });
        if(exist){
            return res.status(403).json({
                message:"User Already exists",
            });
        }

        const hash = await bcrypt.hash(password,10);

        await User.create({
            email,
            username,
            password: hash,
            weight,
            height,
            age,
            role,
            gender,
            bodyType,
        });

        await CartModel.create(
            { email: email, cart: [], purchase:[] }
        )

        const mailOptions = {
            from: {
                name:"Ashutosh Kumar",
                address:process.env.USER_EMAIL
            },
            to: email, // list of receivers
            subject: "Account Created", // Subject line
            text: "Your Account has been created successfully", // plain text body                
            html: "<b>Account Created Successfully</b>", // html body
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
            message:"account created successfully",
            success:true
        });

    }
    catch(error){
        console.log(error);
    }
};
