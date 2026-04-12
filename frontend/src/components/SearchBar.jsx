import React from "react"
import { FaSearch } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-full flex items-center px-4 bg-white/50 border border-stone-200 rounded-lg group focus-within:bg-white/80 transition-all shadow-sm">
      <input
        type="text"
        placeholder="Search memories..."
        className="w-full text-sm bg-transparent py-2.5 outline-none text-stone-700 placeholder:text-stone-400 font-medium"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-lg text-stone-400 cursor-pointer hover:text-stone-600 mr-3 transition-colors"
          onClick={onClearSearch}
        />
      )}

      <FaSearch
        className="text-stone-400 cursor-pointer hover:text-stone-800 transition-colors"
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
