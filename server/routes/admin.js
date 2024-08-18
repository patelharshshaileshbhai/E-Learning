import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { addLecture, createCourse, getAllStats } from "../controller/admin.js";
import { uploadFiles } from "../middlewares/multer.js";
import { deleteCourse, deleteLecture } from "../controller/course.js";

const router=express.Router();


router.post('/course/new',isAuth,isAdmin,uploadFiles,createCourse)
router.post('/course/:id',isAuth,isAdmin,uploadFiles,addLecture)
router.delete('/lecture/:id',isAuth,isAdmin,deleteLecture)
router.delete('/course/:id',isAuth,isAdmin,deleteCourse)
router.get('/stats',isAuth,isAdmin,getAllStats)
export default router