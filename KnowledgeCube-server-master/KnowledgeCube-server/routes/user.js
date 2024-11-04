import express from 'express'
import { forgotPass, loginUser, myProf, register, resetPass, verifyUser } from '../controllers/user.js';
import { isAuth } from '../middlewares/auth.js';
import { addProgress, getProgress } from '../controllers/course.js';

const router = express.Router();

router.post('/user/register', register)
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.post("/user/forgot", forgotPass);
router.post("/user/reset", resetPass);
router.get("/user/me", isAuth, myProf)
router.post("/user/progress",isAuth, addProgress)
router.get('/user/progress',isAuth, getProgress)

export default router;