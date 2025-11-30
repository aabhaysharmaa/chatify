
import mongoose from "mongoose";


const connectDB = async () => {
	if (!process.env.MONGO_DB_URL) {
		throw new Error("MONGO_URI is not exists")
	}
	try {
		const conn = await mongoose.connect(process.env.MONGO_DB_URL);
		console.log(`MongoDB connected with host :  ${conn.connection.host}`)
	} catch (error) {
		console.log("Error in connectDB : ", error.message)
		process.exit(1);
	}
}


export default connectDB;