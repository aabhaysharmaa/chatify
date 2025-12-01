import { useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/auth.store";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Loader2 } from "lucide-react";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3")
const ProfileHeader = () => {
  const { logout, authUser, updateProfile, isUpdatingProfilePic } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    if (!image) return null;
    const reader = new FileReader()
    reader.readAsDataURL(image)

    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image);
      updateProfile({ profilePic: base64Image })
    }
    console.log("Auth User", authUser)
  }
  return (
    <div className="p-6 border-b border-slate-600/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar avatar-online">
            <button className={`size-14 rounded-full overflow-hidden relative group ${isUpdatingProfilePic && "opacity-40"}`} onClick={() => fileInputRef.current?.click()}>
              <img className="size-full object-cover" src={ authUser.user?.profilePic || selectedImg ||  "/avatar.png"} alt="avatarPng" />
              <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer  `}>
                <span className="text-white text-sm">Change</span>
              </div>
              {isUpdatingProfilePic && <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="size-4 text-white animate-spin transition" /></span>}
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
          {/* USER NAME ONLINE TEXT  */}
          <div className="text-slate-200 font-medium text-base max-w-[180px] truncate  ">
            <h3>{authUser.fullName}</h3>
            <p className="text-slate-400 text-sm">Online</p>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex gap-4 items-center text-slate-400 ">
          <LogOutIcon onClick={logout} className="cursor-pointer size-5 hover:text-slate-200" />
          <button className="text-slate-400 hover:text-slate-200 transition-colors" onClick={() => {
            // play click sound before toggling
            mouseClickSound.currentTime = 0
            mouseClickSound.play().catch((error) => console.log("Audio play failed: ", error))
            toggleSound();
          }}>
            {isSoundEnabled ? <Volume2Icon className="cursor-pointer size-5" /> : <VolumeOffIcon className="cursor-pointer size-5" />}
          </button>

        </div>
      </div>
    </div>
  )
}

export default ProfileHeader