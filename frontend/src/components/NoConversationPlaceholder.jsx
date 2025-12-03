import { MessageCircleMore } from "lucide-react";


const NoConversationPlaceholder = () => {
  return (
    <div className='flex  flex-col h-full items-center justify-center w-full p-6 '>
      <div className="size-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
        <MessageCircleMore className="size-10 text-cyan-400" />
      </div>
      <div className="text-center">
        <h3 className='text-3xl font-semibold text-slate-200 mb-2'>Select a Conversation</h3>
        <div className="text-slate-400  max-w-md">
          Choose a contact from the sidebar to start chatting or or continue a previous conversation
        </div>
      </div>
    </div>
  ) 
}

export default NoConversationPlaceholder