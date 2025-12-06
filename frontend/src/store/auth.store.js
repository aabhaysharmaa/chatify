import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import useChatStore from "./useChatStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
const useAuthStore = create((set, get) => ({
	authUser: null,
	isCheckingAuth: false,
	isUpdatingProfilePic: false,
	socket: null,
	onlineUsers: [],
	checkAuth: async () => {
		try {
			set({ isCheckingAuth: true });
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data })
				get().connectSocket();
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			set({ authUser: null })
			toast.error("Something went Wrong!")
		} finally {
			set({ isCheckingAuth: false })
		}

	},
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	signUp: async (data) => {
		try {
			set({ isSigningUp: true })
			const res = await axiosInstance.post("/auth/signup", data)
			set({ authUser: res.data })
			toast.success("success")
				get().connectSocket();
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			set({ authUser: null })
			toast.error(error.response.data.message || "Something went Wrong!")
		} finally {
			set({ isSigningUp: false })
		}
	},
	logIn: async (data) => {
		try {
			set({ isLoggingIn: true })
			const res = await axiosInstance.post("/auth/login", data)
			toast.success("success")
			get().connectSocket();

			set({ authUser: res.data })
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			set({ authUser: null })
			toast.error("Something went Wrong!")
		} finally {
			set({ isLoggingIn: false })
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null })
			toast.success("Logout");
			get().disconnectSocket()
  		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			toast.error("Something went Wrong!")
		}
	},
	updateProfile: async (image) => {
		try {
			set({ isUpdatingProfilePic: true })
			const res = await axiosInstance.put("/auth/update-profile", image)
			set({ authUser: res.data })
			toast.success("Profile Updated Successfully")
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			toast.error("Something went Wrong!")
		} finally {
			set({ isUpdatingProfilePic: false })
		}
	},
	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;
		const socket = io(BASE_URL, { withCredentials: true });
		socket.connect();
		set({ socket })

		// listen for online user events
		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds })
		})

		// listen for incoming messages from server
		socket.on("newMessage", (payload) => {
			try {
				const { userMessages, tempId } = payload || {};
				const msg = userMessages || payload;
				// normalize ids
				if (msg && msg._id) {
					msg.senderId = String(msg.senderId);
					msg.receiverId = String(msg.receiverId);
				}

				useChatStore.setState((state) => {
					const existing = state.messages || [];
					// if tempId provided, replace optimistic message
					if (tempId) {
						return {
							messages: existing.map(m => m._id === tempId ? (msg.userMessages || msg) : m)
						}
					}

					// avoid duplicates
					if (!existing.find(m => String(m._id) === String(msg._id))) {
						return { messages: [...existing, (msg.userMessages || msg)] }
					}
					return {}
				})
			} catch (e) {
				console.error('Error handling newMessage socket event', e)
			}
		})
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect() ;
	}
}));

export default useAuthStore;
