import express from "express";
const app = express();
import { config } from "dotenv";
config();
import path from "path";
import cookieParser from "cookie-parser";




import connectDB from "./libs/connectDB.js";
const PORT = process.env.PORT || 3000
import auth from "./routes/auth.routes.js";




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//routes

app.use("/api/v1/auth", auth);
// app.use("api/v1/messages");

const __dirname = path.resolve(); // current file absolute location

// make ready for deployment
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (_, res) => {
		res.sendFile(path.join(__dirname, "dist", "index.html"))
	})
}



app.listen(PORT, () => {
	connectDB();
	console.log(`Express Sever was running on the PORT : ${PORT}`)
})

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" })
})