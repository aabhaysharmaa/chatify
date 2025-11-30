import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const Protected = async (req, res, next) => {
	const cookie = req.cookies.jwt;
	if (!cookie) {
		return res.status(400).json({ message: "JWT cookie is missing" })
	}
	try {
		const decode = jwt.verify(cookie, process.env.JWT_SECRET);
		if (!decode) {
			return res.status(400).json({ message: "Unauthorized - invalid token" })
		}
		console.log(decode)
		const user = await User.findById(decode.userId)
		if (!user) {
			return res.status(400).json({ message: "No User founded" })
		}
		req.user = user;
		next();
	} catch (error) {
		console.log("Error in middleware (Protected) : ", error.message);
		throw new Error(error.message);
	}
}
export default Protected;