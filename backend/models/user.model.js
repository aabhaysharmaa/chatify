import mongoose from "mongoose";


const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
	},
	fullName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: [6, "Password must be at least 6 character long"],
	},
	profilePic: {
		type: String,
		default: ""
	}


}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;