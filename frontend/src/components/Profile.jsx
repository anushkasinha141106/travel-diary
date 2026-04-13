import React from "react"
import { useSelector } from "react-redux"
import { getInitials } from "../utils/helper"
import BASE_URL from "../config"

const Profile = ({ onLogout }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-stone-800 font-bold bg-stone-100 border border-stone-200">
        {getInitials(currentUser?.username)}
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-bold text-stone-800 tracking-tight">{currentUser.username || ""}</p>
        <button className="text-[10px] uppercase tracking-widest font-black text-red-500 hover:text-red-600" onClick={onLogout}>
          Logout
        </button>
      </div>
      
      <button className="sm:hidden text-stone-400 hover:text-red-500 transition-colors" title="Logout" onClick={onLogout}>
        <div className="text-[10px] font-black border border-stone-300 px-2 py-1 rounded-md uppercase">OUT</div>
      </button>
    </div>
  )
}

export default Profile
