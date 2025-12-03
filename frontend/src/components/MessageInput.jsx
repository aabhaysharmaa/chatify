import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import useChatStore from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, X } from "lucide-react";

const MessageInput = () => {
	const [text, setText] = useState("");
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const inputRef = useRef(null);
	const { sendMessage, isSoundEnabled } = useChatStore();
	const { playRandomStrokeSound } = useKeyboardSound();

const handleSendMessage = async (e) => {
	e.preventDefault();
	if (!text.trim() && !imageFile) return  ;
	if (isSoundEnabled) playRandomStrokeSound();

	let base64Image = null

	if (imageFile) {
		const reader = new FileReader();
		reader.onload = async () => {
			base64Image = reader.result;

			await sendMessage({
				text: text.trim(),
				image: base64Image
			});

			// reset
			setText("");
			setImagePreview(null);
			setImageFile(null);
			if (inputRef.current) inputRef.current.value = "";
		};

		reader.readAsDataURL(imageFile);
	} else {
		await sendMessage({
			text: text.trim(),
			image: null
		});

		setText("");
	}
};


	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		setImageFile(file);

		const reader = new FileReader();
		reader.onload = () => setImagePreview(reader.result);
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImagePreview(null);
		setImageFile(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<div className="p-4 border-t border-slate-700/50">
			{imagePreview && (
				<div className="max-w-3xl mx-auto mb-3 flex items-center">
					<div className="relative">
						<img
							src={imagePreview}
							alt="preview"
							className="w-20 h-20 object-cover rounded-lg border border-slate-700"
						/>
						<button
							className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
							onClick={removeImage}
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-2">
				<input
					type="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						if (isSoundEnabled) playRandomStrokeSound();
					}}
					className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
					placeholder="Type your message..."
				/>

				<input
					type="file"
					ref={inputRef}
					className="hidden"
					onChange={handleImageChange}
					accept="image/*"
				/>

				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className={`bg-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""}`}
				>
					<ImageIcon className="w-5 h-5" />
				</button>

				<button type="submit" className="bg-cyan-600 text-white px-4 rounded-lg cursor-pointer">
					Send
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
