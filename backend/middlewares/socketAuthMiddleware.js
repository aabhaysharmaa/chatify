import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import "dotenv/config";

const SocketAuthMiddleware = async (socket, next) => {
	try {
		// extract token from http-only cookies
		const token = socket.handshake.headers.cookie
			?.split("; ")
			.find((row) => row.startsWith("jwt="))
			?.split("=")[1];

		if (!token) {
			console.log("Socket connection rejected : No token provided");
			return next(new Error("Unauthorized - No Token Provided"));
		}

		const decode = jwt.verify(token, process.env.JWT_SECRET);
		if (!decode) {
			console.log("Socket connection rejected: Invalid token");
			return next(new Error("Unauthorized - Invalid Token"))
		}

		const user = await User.findById(decode.userId).select("-password")
		console.log("socket User : ", user);


		if (!user) {
			console.log("Socket connection rejected : User not found");
			return next(new Error("User Not Found"))
		}
		//  Attach  user to  socket request server
		socket.user = user;
		socket.userId = user?._id
		next();
	} catch (error) {
		console.log(error.message)
		return (new Error("Unauthorized"));
	}
}

export default SocketAuthMiddleware;