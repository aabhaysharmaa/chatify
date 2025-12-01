import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: false,
	checkAuth: async () => {
		try {
			set({ isCheckingAuth: true });
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data })
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			set({ authUser: null })
			toast.error(error.response.data.message || "Something went Wrong!")
		} finally {
			set({ isCheckingAuth: false })
		}

	},
	isSigningUp: false,
	isLoggingIn: false,
	signUp: async (data) => {
		try {
			set({ isSigningUp: true })
			const res = await axiosInstance.post("/auth/signup", data)
			set({ authUser: res.data })
			toast.success("success")
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

			set({ authUser: res.data })
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			set({ authUser: null })
			toast.error(error.response.data.message || "Something went Wrong!")
		} finally {
			set({ isLoggingIn: false })
		}
	},
	logOut: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({authUser : null})
			toast.error("LogOut");
		} catch (error) {
			console.log("Error in checkAuth : ", error.response.data.message)
			toast.error(error.response.data.message || "Something went Wrong!")
		}
	}
}));




















export default useAuthStore;
