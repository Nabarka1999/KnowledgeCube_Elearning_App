import express from 'express'
import { checkOut, fetchLectures, fetchOneLecture, getAllCourses, getMyCourses, getOneCourse, payVerification } from '../controllers/course.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getOneCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchOneLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/course/checkout/:id", isAuth, checkOut)
router.post("/verification/:id",isAuth, payVerification) //payment verification


export default router;