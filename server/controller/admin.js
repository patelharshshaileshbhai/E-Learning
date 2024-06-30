import TryCatch from "../middlewares/TryCatch.js";
import {Course} from '../models/Courses.js'
export const createCourse=TryCatch(async(req,res)=>{
    const {title,description,price,duration,category,createdBy}=req.body;

const image=req.file;

    await Course.create({
        title,
        description,
        image:image?.path,
        price,
        duration,
        category,
        createdBy
    })
    res.status(201).json({message:"Course created successfully"})
})