import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import uploadToCloudinary from "../libs/uploadToCloudinary.js";
import { io, userSocketMap } from "../libs/socket.js";
export const getMessagesById = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId || !myId) {
      return res.status(400).json({ message: "Id is not defined" });
    }

    // Fetch messages between two users and sort by creation time (ascending)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // oldest → newest

    if (!messages || messages.length === 0) {
      return res.status(200).json([]); // return empty array instead of 400
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesById:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
	try {
		const currentUser = req.user._id;
		//  find all the  messages where currentLogged in  User is sender or receiver
		const allMessages = await Message.find({
			$or: [
				{ senderId: currentUser },
				{ receiverId: currentUser }
			]
		})
		const chatPartnerIds = [...new Set(allMessages.map((msg) => msg.senderId.toString() === currentUser.toString() ? msg.receiverId : msg.senderId.toString()))];

		const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
		return res.status(200).json(chatPartners);

	} catch (error) {
		console.log("Error in getChatPartners : ", error.message);
		res.status(500).json(error.message);
	}
}
export const getAllContacts = async (req, res) => {
	try {
		const currentUser = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: currentUser } }).select("-password");
		return res.status(200).json(filteredUsers);
	} catch (error) {
		console.log("Error in getAllContacts : ", error.message)
	}
}

export const sendMessage = async (req, res) => {
	try {
		const { text, image, tempId } = req.body;
		if (!text && !image) {
			return res.status(400).json({ message: "Text and image is required" })
		}
		const senderId = req.user._id;
		const { id: receiverId } = req.params;
		if (senderId.equals(receiverId)) {
			return res.status(400).json({ message: "Cannot send messages to yourself" })
		}
		let uploadImage;
		if (image) {
			uploadImage = await uploadToCloudinary(image)
		}

		// upload base64 to cloudinary
		const userMessages = new Message({
			senderId,
			receiverId,
			image: uploadImage,
			text
		})
		await userMessages.save();

		// Prepare payload to emit and respond
		const payload = { userMessages, tempId };

		// Emit to receiver if online
		const receiverSocketId = userSocketMap[String(receiverId)];
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", payload);
		}

		// Also emit to sender's socket to confirm delivery (if different)
		const senderSocketId = userSocketMap[String(senderId)];
		if (senderSocketId && senderSocketId !== receiverSocketId) {
			io.to(senderSocketId).emit("newMessage", payload);
		}

		return res.status(201).json(payload)
	} catch (error) {
		console.log("Error in sendMessage : ", error.message)
		res.status(500).json({ message: 'Internal server error' })
	}
}