import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { createCourse } from "../controller/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router=express.Router();


router.post('/course/new',isAuth,isAdmin,uploadFiles,createCourse)
export default router