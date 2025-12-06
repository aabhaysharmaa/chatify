/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import useAuthStore from "../store/auth.store.js";
import useChatStore from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessageSkeleton.jsx";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!authUser || !selectedUser) {
    return <MessagesLoadingSkeleton />;
  }
console.log("Messages",messages);
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <ChatHeader />

      {/* Chat messages */}
      <div className="flex-1 px-6 overflow-y-auto py-8 bg-gray-900">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isMine = msg.senderId === authUser.user._id;
              return (
                <div
                  key={msg._id}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  {/* Show avatar only for received messages */}
                  {!isMine && (
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={selectedUser.profilePic || "/avatar.png"}
                          alt={selectedUser.fullName}
                        />
                      </div>
                    </div>
                  )}

                  {/* Chat header: name + timestamp */}
                  <div className="chat-header">
                    {!isMine ? selectedUser.fullName : "You"}
                    <time className="text-xs opacity-50 ml-2">
                      {msg.createdAt &&
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </time>
                  </div>

                  {/* Chat bubble */}
                  <div
                    className={`chat-bubble ${
                      isMine ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg h-48 object-cover mb-2"
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Message input */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
