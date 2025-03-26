import { Router } from "express";
import { getShuffledQuestions } from "../controllers/questionController.js";



const questionRoute = Router()

questionRoute.get('/suffled-question', getShuffledQuestions)




export default questionRoute