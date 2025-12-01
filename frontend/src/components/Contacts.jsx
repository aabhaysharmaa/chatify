import React, { useEffect } from 'react'
import UsersLoadingSkeleton from './UserLoadingSkeleton';
import useChatStore from '../store/useChatStore';


const Contacts = () => {
  const { getAllContacts, allContacts, isUserLoading, setSelectedUser } = useChatStore();
  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])
  if (isUserLoading) return <UsersLoadingSkeleton />
  if (allContacts.length === 0) return null;
  return (
    <div>{allContacts.map((contact) => (
      <div className="bg-cyan-500/10 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors" onClick={() => setSelectedUser(contact)} key={contact._id}>
        <div className="flex items-center mt-4 p-3">
          <div className="avatar avatar-online">
            <div className="size-12 rounded-full">
              <img src={contact.profilePic || "/avatar.png"} alt="contactsProfilePic" />
            </div>
          </div>
          <h4>{allContacts.fullName}</h4>
        </div>
      </div>
    ))}</div>
  )
}

export default Contacts