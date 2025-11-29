
import mongoose from "mongoose";


const  connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_DB_URL);
		console.log(`MongoDB connected with host :  ${conn.connection.host}`)
	} catch (error) {
		console.log("Error in connectDB : ", error.message)
		throw new Error(error.message)
	}
}


export default connectDB ;