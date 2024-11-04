import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUsers, updateRole } from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats)
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUsers)

export default router;