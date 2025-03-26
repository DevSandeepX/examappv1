import express from "express";
import "dotenv/config";
import cors from "cors"
import connectDb from "./config/connectDb.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import questionRoute from "./routes/questionRoute.js";
import examRoute from "./routes/examRoute.js";
const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors({
    origin:'https://gyansthalyv1.onrender.com'
}))
connectDb();
app.get("/", (req, res) => {
    res.send("Server is Live")
})

app.use("/api/admin/", adminRoute)
app.use("/api/user/", userRoute)
app.use("/api/question/", questionRoute)
app.use("/api/exam/", examRoute)


app.listen(port, () => {
    console.log(`App is Live http://localhost:${port}`)
})
