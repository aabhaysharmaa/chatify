import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: false,
	isUpdatingProfilePic : false,
	checkAuth: async () => {
		try {
			set({ isCheckingAuth: true });
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data })
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
	}
}));



export default useAuthStore;
