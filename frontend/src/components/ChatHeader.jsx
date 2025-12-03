import { X } from "lucide-react";
import useChatStore from "../store/useChatStore";
import { useEffect } from "react";
import MessageInput from "./MessageInput";
const ChatHeader = () => {
	const { selectedUser, setSelectedUser } = useChatStore();


	useEffect(() => {
		const handleEsckey = (event) => {
			if (event.key === "Escape") setSelectedUser(null);
		}
		window.addEventListener("keydown", handleEsckey)
	},[selectedUser , setSelectedUser])

	return (
		<div className='flex justify-between items-center border-b bg-cyan-900/30  py-7 border-slate-800/50  px-6  '>
			<div className="flex items-center space-x-3 ">
				<div className="avatar avatar-online">
					<div className=" w-12 rounded-full">
						<img src={selectedUser?.profilePic || "/avatar.png"} alt="pic" className="size-12" />
					</div>
				</div>
				<div className="">
					<h3 className="font-medium text-slate-200">{selectedUser?.fullName}</h3>
					<span className="text-slate-400 text-sm">online</span>
				</div>
			</div>
			<button onClick={() => setSelectedUser(null)} className="">
				<X className="text-slate-500 hover:text-slate-400 cursor-pointer size-8 " />
			</button>

		</div>
	)
}

export default ChatHeader