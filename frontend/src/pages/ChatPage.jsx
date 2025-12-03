import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import useChatStore from '../store/useChatStore';
import ChatList from "../components/ChatList";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore()
  return (
    <div className='relative w-full flex  max-w-6xl h-[800px]'>
      <BorderAnimatedContainer>
        {/* left Side */}

        <div className="w-80  bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2 ">
            {activeTab === "chats" ? <ChatList /> : <Contacts />}
          </div>

        </div>
        {/*  RIGHT SIDE  */}
        <div className=" flex-1 flex  flex-col   w-full h-full  backdrop-blur-sm ">
          {selectedUser ? < ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
