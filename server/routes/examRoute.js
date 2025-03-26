import { Router } from "express";
import { finishExam } from "../controllers/examController.js";

const exam = (req, res)=>{
    res.json({msg:"All is correct"})
}


const examRoute = Router()

// examRoute.post('/finish-exam', finishExam)
examRoute.post('/finish-exam', finishExam)
examRoute.post('/exam', exam)




export default examRoute