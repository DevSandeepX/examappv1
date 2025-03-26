import { Router } from "express";
import { handleAddQuestion, handleAddStudent, handleAdminLogin, handleDeleteStudent, handleGetStudent, handleGetSuffledQuestions, handleUpdateStudent } from "../controllers/adminController.js";
import { addStudent, deleteStudent, getAllStudents, updateStudent } from "../controllers/studentController.js";

const adminRoute = Router()
adminRoute.post("/add-student", addStudent)
adminRoute.put('/update-student/:id', updateStudent);
adminRoute.delete('/delete-student/:id', deleteStudent);
adminRoute.get("/students", getAllStudents)

adminRoute.post("/auth", handleAdminLogin)

// adminRoute.post("/add-question", handleAddQuestion)
// adminRoute.post("/get-question", handleGetSuffledQuestions)





export default adminRoute