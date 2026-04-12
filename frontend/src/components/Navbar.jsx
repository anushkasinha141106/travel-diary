import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Profile from "./Profile"
import axiosInstance from "../utils/axiosInstance"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useDispatch } from "react-redux"
import SearchBar from "./SearchBar"

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/signout")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    handleClearSearch()
    setSearchQuery("")
  }

  return (
    <div className="bg-white/40 backdrop-blur-md flex items-center justify-between px-6 md:px-14 py-4 sticky top-0 z-40 border-b border-white/30 mix-blend-multiply">
      <Link to={"/"} className="group">
        <h1 className="flex flex-col leading-none">
          <span className="text-[1.4rem] font-bold tracking-[0.2em] text-stone-800 group-hover:text-stone-900 transition-colors uppercase">Travel</span>
          <span className="text-[1.1rem] font-medium tracking-[0.4em] text-[#8e826b] flex items-center gap-2 italic">
            JOURNAL
            <div className="h-[1px] w-8 bg-[#8e826b] opacity-40 grow" />
          </span>
        </h1>
      </Link>

      <div className="flex-1 max-w-md mx-8">
        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>

      <Profile onLogout={onLogout} />
    </div>
  )
}

export default Navbar
