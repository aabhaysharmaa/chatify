import cloudinary from "./cloudinary.js";

const uploadToCloudinary = async (image) => {
	const uploadedImage = await cloudinary.uploader.upload(image)
	return uploadedImage.secure_url;
}

export default uploadToCloudinary ;