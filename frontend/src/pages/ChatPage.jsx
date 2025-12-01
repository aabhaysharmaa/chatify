import React from 'react'
import useAuthStore from '../store/auth.store'
import Loader from '../components/Loader';

const ChatPage = () => {
  const { logOut } = useAuthStore();

  return (
    <div>
      <button onClick={() =>  logOut()} className='hover:bg-amber-400 text-2xl '>Logout</button>

    </div>
  )
}

export default ChatPage