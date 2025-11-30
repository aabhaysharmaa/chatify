import generateToken from "../libs/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
	try {
		const { fullName, email, password } = req.body;
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "password Should be at least  6 character" })
		}
		// check if email is valid regex
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email formate" })

		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ message: "User Already exists!" });

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new User({
			fullName,
			email,
			password: hashedPassword
		})

		if (newUser) {
			generateToken(newUser._id, res);
			await newUser.save();
			return res.status(201).json(newUser);
		} else {
			res.status(400).json({ message: "Invalid user data" })
		}
	} catch (error) {
		console.log("Error in signin controller : ", error.message);
		res.status(500).json({ message: error.message })
	}

}
export const signin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email | !password) {
			return res.status(400).json({ message: "Both field is required" })
		}
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: "No user founded" })
		}
	} catch (error) {
		console.log("Error in signin Controller :", error.message)
	}
}
export const logout = async (req, _) => {
	res.cookies("token")
}