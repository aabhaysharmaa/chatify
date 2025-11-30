import jwt from "jsonwebtoken";

const isAuth = (res, res, next) => {
	const cookie = req.cookies.jwt;
	if (!cookie) {
		return res.status(400).json({ message: "JWT cookie is missing" })
	}
	try {
		const decode = jwt.verify(cookie, process.env.JWT_SECRET);
		if (!decode) {
			return res.status(400).json({ message: "Token is invalid" })
		}
		req.user = decode
		next();
	} catch (error) {
		console.log("Error in middleware (isAuth) : ", error.message)
	}
}
export default isAuth;