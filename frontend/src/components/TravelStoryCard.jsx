import { motion } from "framer-motion"
import React from "react"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaHeart } from "react-icons/fa"

const TravelStoryCard = ({
  imageUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onEdit,
  onClick,
  onFavouriteClick,
  charm,
  charmPosition,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative p-4 pb-14 bg-white rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-[#d6d0c4] cursor-pointer group flex flex-col h-full"
      onClick={onClick}
    >
      {/* Wooden Peg / Clip element (Matches Login Grid) */}
      <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-8 h-6 bg-[#b1a491] shadow-sm border-b-[2px] border-[#928676] rounded-t-[2px] z-20 flex items-center justify-center transform -rotate-1">
        <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
      </div>

      <div className="relative overflow-hidden bg-[#f3f1ed] flex-1 min-h-[220px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />

        {/* Decorative Charm Sticker */}
        {charm && (
          <div
            className="absolute bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md border border-white/50 pointer-events-none z-10"
            style={{
              left: `${charmPosition?.x || 0}px`,
              top: `${charmPosition?.y || 0}px`,
              transform: "scale(0.85)",
            }}
          >
            <img src={charm} alt="charm" className="w-8 h-8 object-contain" />
          </div>
        )}
      </div>

      <button
        className={`w-9 h-9 flex items-center justify-center rounded-full absolute top-6 right-6 z-30 transition-all ${
          isFavourite ? "bg-red-500 text-white shadow-lg" : "bg-white/60 text-stone-400 backdrop-blur-md hover:text-red-500"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick();
        }}
      >
        <FaHeart className="text-sm" />
      </button>

      <div className="mt-5 px-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h6 className="text-[17px] font-bold text-stone-800 leading-tight uppercase tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            {title}
          </h6>
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 whitespace-nowrap mt-1">
            {date ? moment(date).format("MMM YYYY") : "-"}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 italic">
          {story}
        </p>

        <div className="pt-2 flex items-center gap-1.5 overflow-hidden">
          <FaLocationDot className="text-[10px] text-[#8e826b]" />
          <div className="text-[10px] font-bold text-[#8e826b] uppercase tracking-wider truncate">
            {visitedLocation.join(", ")}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TravelStoryCard
