import express from "express";
const app = express();
import { config } from "dotenv";
config();

import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./libs/connectDB.js";
const PORT = process.env.PORT || 3000
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js"



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}))

//routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);


// const __dirname = path.resolve(); // current file absolute location

// make ready for deployment
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "../frontend/dist")));
// 	app.get("*", (_, res) => {
// 		res.sendFile(path.join(__dirname, "dist", "index.html"))
// 	})
// }



app.listen(PORT, () => {
	connectDB();
	console.log(`Express Sever was running on the PORT : ${PORT}`)
})

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" })
})