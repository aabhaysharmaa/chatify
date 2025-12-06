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
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser?._id || !authUser?.user?._id) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
        _id: tempId,
        senderId: String(authUser?.user?._id),
        receiverId: String(selectedUser._id),
        text: messageData.text,
        createdAt: new Date().toISOString(),
        optimistic: true,
    };

    // Add optimistic UI
    set((state) => ({
        messages: [...(state.messages || []), optimisticMessage]
    }));

    // ✅ FIX: SEND SOCKET EVENT (this was missing)
    useAuthStore.getState().socket?.emit("sendMessage", {
        receiverId: selectedUser._id,
        message: messageData.text,
        tempId,
    });

    try {
        // Save to DB too
        const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            { ...messageData, tempId }
        );

        const payload = res.data;
        const realMessage = payload?.userMessages ? payload.userMessages : payload;
        const returnedTempId = payload?.tempId;

        if (realMessage && realMessage._id) {
            realMessage.senderId = String(realMessage.senderId);
            realMessage.receiverId = String(realMessage.receiverId);
        }

        // Replace optimistic
        set((state) => ({
            messages: (state.messages || []).map(msg =>
                (msg._id === (returnedTempId || tempId)) ? realMessage : msg
            )
        }));

    } catch (error) {
        console.error(error);
        toast.error("Message failed to send");

        // Remove optimistic on error
        set((state) => ({
            messages: (state.messages || []).filter(msg => msg._id !== tempId)
        }));
    }
}



}));




export default useChatStore;
