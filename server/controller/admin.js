import TryCatch from "../middlewares/TryCatch.js";
import {Courses} from '../models/Courses.js'
import { Lecture } from "../models/lecture.js";
export const createCourse=TryCatch(async(req,res)=>{
    const {title,description,price,duration,category,createdBy}=req.body;

const image=req.file;

    await Courses.create({
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

export const addLecture=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id);

    if(!course) return res.status(404).json({message:"Course not found"})
    
    const {title,description}=req.body;
    const file=req.file;
    const lecture=await Lecture.create({
        title,
        description,
        video:file?.path,
        course:course._id
    })
    res.status(200).json({message:"Lecture added successfully",lecture})
})