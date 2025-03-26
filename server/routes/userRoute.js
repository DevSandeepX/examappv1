import { Router } from "express";
import { verifyStudent } from "../controllers/studentController.js";




const userRoute = Router()
// userRoute.post("/finish-exam", finishExam)
// userRoute.post("/get-student", getStudent)
// userRoute.get("/get-students", getAllStudent)
userRoute.post("/verify-student", verifyStudent)





export default userRoute