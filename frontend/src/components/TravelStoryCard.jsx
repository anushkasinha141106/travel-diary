import { motion } from "framer-motion"
import React from "react"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaHeart } from "react-icons/fa"
import BASE_URL from "../config"

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
  // Ensure the image URL is absolute for access across devices
  const fullImageUrl = imageUrl?.startsWith("http") 
    ? imageUrl 
    : ((imageUrl?.startsWith("/uploads") || imageUrl?.startsWith("/assets")) ? `${BASE_URL}${imageUrl}` : imageUrl);

  const fullCharmUrl = charm?.startsWith("http") 
    ? charm 
    : ((charm?.startsWith("/uploads") || charm?.startsWith("/assets")) ? `${BASE_URL}${charm}` : charm);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="relative p-2.5 md:p-4 pb-12 md:pb-16 bg-white/60 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/50 cursor-pointer group flex flex-col h-full transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden"
      onClick={onClick}
    >
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply" />
      {/* Wooden Peg Element */}
      <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-6 h-4 md:w-8 md:h-6 bg-[#b1a491] shadow-sm border-b-[2px] border-[#928676] rounded-t-[1px] z-20 flex items-center justify-center transform -rotate-1">
        <div className="w-1 h-1 rounded-full bg-black/10" />
      </div>

      <div className="relative overflow-hidden bg-stone-100 rounded-[1.2rem] md:rounded-[1.5rem] flex-1 min-h-[220px] md:min-h-[260px] shadow-sm">
        <img
         src={fullImageUrl ? `${fullImageUrl}?t=${new Date().getTime()}` : ""}
         alt={title}
         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
       />

        {/* Decorative Charm Sticker */}
        {charm && (
          <div
            className="absolute bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md border border-white/50 pointer-events-none z-10"
            style={{
              left: `${charmPosition?.x || 0}px`,
              top: `${charmPosition?.y || 0}px`,
              transform: "scale(0.8)",
            }}
          >
            <img src={fullCharmUrl} alt="charm" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
          </div>
        )}
      </div>

      <button
        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full absolute top-5 right-5 md:top-6 md:right-6 z-30 transition-all ${
          isFavourite ? "bg-red-500 text-white shadow-lg" : "bg-white/70 text-stone-400 backdrop-blur-md hover:text-red-500"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick();
        }}
      >
        <FaHeart className="text-[12px] md:text-sm" />
      </button>

      <div className="mt-5 md:mt-7 px-2 space-y-2 md:space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <h6 className="text-[16px] md:text-[20px] font-black text-stone-900 leading-[1.2] uppercase tracking-tighter line-clamp-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            {title}
          </h6>
          <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-[#8e826b] px-2 py-1 bg-[#8e826b]/5 rounded-md whitespace-nowrap mt-1">
            {date ? moment(date).format("MMM YYYY") : "-"}
          </span>
        </div>

        <p className="text-[12px] md:text-[13px] text-stone-500 leading-relaxed line-clamp-3 font-medium opacity-90 tracking-tight">
          {story}
        </p>

        <div className="pt-3 md:pt-4 flex items-center gap-2 border-t border-stone-100/60">
          <div className="p-1.5 bg-[#8e826b]/10 rounded-full">
            <FaLocationDot className="text-[10px] text-[#8e826b]" />
          </div>
          <div className="text-[10px] md:text-[11px] font-black text-[#8e826b] uppercase tracking-[0.1em] truncate">
            {visitedLocation?.join(", ")}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TravelStoryCard

