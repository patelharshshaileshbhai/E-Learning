import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";
import {rm} from 'fs'
import { promisify } from "util";
import fs from "fs";

export const getAllCourses=TryCatch(async(req,res)=>{

    const courses=await Courses.find();
    res.status(200).json({courses})
});

export const getSingleCourse=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id);
    res.status(200).json({course})
})

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.findOne({ course: req.params.id });
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.status(200).json({ lectures });
    }

    if (user.role === "user") {
        if (!lectures) return res.status(404).json({ message: "No lectures found" });

        // Check if the course is already in the subscription
        const subscriptionIndex = user.subscription.findIndex(sub => sub.course.equals(req.params.id));

        if (subscriptionIndex !== -1) {
            // If course is found, increment the access count
            user.subscription[subscriptionIndex].accessCount += 1;
        } else {
            // If course is not found, add it to the subscription with an access count of 1
            user.subscription.push({ course: req.params.id, accessCount: 1 });
        }

        await user.save();
        return res.status(200).json({ lectures });
    }
});

export const fetchLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);
    
     const user=await User.findById(req.user._id)
     
    if(user.role==="admin") {return res.status(200).json({lecture})
    };
    if(!user.subscription.includes(user.id)) {
        return res.status(401).json({message:"Please subscribe to access this resource"})};
    res.status(200).json({lecture});
})

export const deleteLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);

    rm(lecture.video,()=>{
        });

        await lecture.deleteOne();

    res.status(200).json({message:"Lecture deleted successfully"})
})

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
    try {
        const course = await Courses.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lectures = await Lecture.find({ course: req.params.id });
        
        // If lectures are found, delete the videos
        if (lectures && lectures.length > 0) {
            await Promise.all(
                lectures.map(async (lecture) => {
                    await unlinkAsync(lecture.video);
                })
            );
        }

        // Delete course image
        await promisify(fs.rm)(course.image, { force: true });

        // Delete the lectures associated with the course
        await Lecture.deleteMany({ course: req.params.id });

        // Delete the course itself
        await course.deleteOne();

        // Remove the course from users' subscriptions
        await User.updateMany({}, { $pull: { subscription: req.params.id } });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const getMyCourses=TryCatch(async(req,res)=>{
    const courses=await Courses.find({_id:req.user.subscription});
    res.status(200).json({courses})
})