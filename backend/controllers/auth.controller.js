import emailHandlers from "../emails/emailHandlers.js";
import cloudinary from "../libs/cloudinary.js";
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
			const savedUser = await newUser.save();
			generateToken(newUser._id, res);
			res.status(201).json(savedUser);

			try {
				emailHandlers(fullName, email, process.env.CLIENT_URL)
			} catch (error) {
				console.log("Error in email sending (signup controller)", error.message)
			}

		} else {
			res.status(400).json({ message: "Invalid user data" })
		}
	} catch (error) {
		console.log("Error in signin controller : ", error.message);
		res.status(500).json({ message: error.message })
	}

}
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email | !password) {
			return res.status(400).json({ message: "All field is required" })
		}
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: "Invalid Credentials" })
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid Credentials" })
		}
		generateToken(user._id, res);
		user.password = undefined;
		res.status(200).json({ user: user, message: "Login SuccessFull" })
	} catch (error) {
		console.log("Error in signin Controller :", error.message)
	}
}
export const logout = async (_, res) => {
	res.cookie("jwt", "", { maxAge: 0 })
	res.status(200).json({ message: "User logged Out SuccessFully" })
}

export const updateProfile = async () => {
	try {
		const { profilePic } = req.body;
		if (!profilePic) return res.status(400).json({ message: "Profile pic is required" })
		const userId = req.user._id
		const uploadResponse = await cloudinary.uploader.upload(profilePic) // upload response
		const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
		return res.status(201).json(updatedUser);
	} catch (error) {
		console.log("Error in update profile :", error);
		res.status(500).json({ message: "Internal server Error"}); 
	}
}