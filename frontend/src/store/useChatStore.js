import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
const useChatStore = create((set, get) => ({
	allContacts: [],
	chats: [],
	messages: [],
	activeTab: "chats",
	selectedUser: null,
	isUserLoading: false,
	isMessagesLoading: false,
	isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
	toggleSound: () => {
		localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
		set({ isSoundEnabled: !get().isSoundEnabled })
	},
	setActiveTab: (tab) => set({ activeTab: tab }),
	setSelectedUser: (selectedUser) => set({ selectedUser }),
	getAllContacts: async () => {
		try {
			set({ isUserLoading: true })
			const res = await axiosInstance.get("/messages/contacts");
			set({ allContacts: res.data });
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			toast.error("Something went Wrong!")
			set({ allContacts: [] });
		} finally {
			set({ isUserLoading: false })
		}
	},
	getMyChatPartners: async () => {
		try {
			set({ isUserLoading: true })
			const res = await axiosInstance.get("/messages/chats");
			set({ chats: res.data });
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			toast.error("Something went Wrong!")
		} finally {
			set({ isUserLoading: false })
		}

	},
}))


export default useChatStore;
