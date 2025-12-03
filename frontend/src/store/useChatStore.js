import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import useAuthStore from "./auth.store";
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
	setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
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
	getMessagesByUserId: async (userId) => {
		try {
			if (!userId) return;
			set({ isMessagesLoading: true })
			const res = await axiosInstance.get(`/messages/${userId}`);
			console.log("Messages By Id : ", res.data)
			set({ messages: res.data });
		} catch (error) {
			console.log(error.response.data.message);
			toast.error("Something went wrong!")
		} finally {
			set({ isMessagesLoading: false })
		}
	},
	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();
		const { authUser } = useAuthStore.getState();
		// 1. Create optimistic message (fake, for UI only)
		const tempId = Date.now().toString()

		const optimisticMessage = {
			_id: tempId,
			tempId,
			senderId: authUser.user._id,
			receiverId: selectedUser._id,
			text: messageData.text,
			createdAt: new Date().toISOString(),
			optimistic: true
		};
		// // 2. SHOW MESSAGE IN UI INSTANTLY
		set({ messages: [...messages, optimisticMessage] });
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser._id}`,
				messageData
			);

			// 3. Replace optimistic message with real one
			set((state) => ({
				messages: state.messages.map(msg =>
					msg.optimistic ? res.data : msg
				)
			}));
		} catch (error) {
			console.error(error);
			set({ messages: messages })
			toast.error("Message failed to send");

			// 4. Remove failed optimistic message
			set((state) => ({
				messages: state.messages.filter(m => !m.optimistic)
			}));
		}
	}

}));




export default useChatStore;
