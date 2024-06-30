import sendMail from "../middlewares/sendMail.js";
import {User} from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import TryCatch from "../middlewares/TryCatch.js";
dotenv.config();
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "User already exists" });
        }
          
        const hashedPassword = await bcrypt.hash(password, 10);
       
        user = {
            name,
            email,
            password: hashedPassword
        };
        
        const otp = Math.floor(100000 + Math.random() * 1000000); // Generate a 6-digit OTP

        const activationToken = jwt.sign(
            { user, otp },
            process.env.ACTIVE_SECRET,
            { expiresIn: "10m" }
        );
       
        const data = {
            name,
            otp
        };

       
        await sendMail({
            email,
            subject: "OTP Verification",
            data
        });

        // Save the user to the database
       

        res.status(200).json({ message: "OTP sent successfully", activationToken });
})

export const verifyUser =  TryCatch(async (req, res) => {
    const { otp,activationToken } = req.body;

    const verify=jwt.verify(activationToken,process.env.ACTIVE_SECRET);

    if(!verify){
        return res.status(401).json({ message: "OTP expired" });
    }
       
    if(verify.otp !== otp){
        return res.status(401).json({ message: "Invalid OTP" });    

    }
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password
    });

    res.status(200).json({ message: "User created successfully" });
})

export const loginUser=TryCatch(async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
   
    const matchPass=await bcrypt.compare(password,user.password);
    if(!matchPass){
        return res.status(400).json({message:"Invalid Password"});
    }
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    res.status(200).json({message:`Welcome Back ${user.name}`,token,user});
})

export const myProfile=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id);
    res.status(200).json({user});
})