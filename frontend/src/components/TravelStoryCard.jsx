import React from "react"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaHeart } from "react-icons/fa"
import BASE_URL from "../config.js"
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
}) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-56 object-cover"
        onClick={onClick}
      />

      {/* Decorative Charm Sticker */}
      {charm && (
        <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-full text-2xl shadow-sm border border-white/50 pointer-events-none">
          {charm}
        </div>
      )}

      <button
        className="w-10 h-10 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart
          className={`icon-btn ${
            isFavourite ? "text-red-500" : "text-white"
          } hover:text-red-500`}
        />
      </button>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-[16px] font-medium">{title}</h6>

            <span className="text-xs text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {story?.slice(0, 60)}
          {story?.length > 60 && "..."}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
            <FaLocationDot className="text-sm" />

            {visitedLocation.map((item, index) =>
              visitedLocation.length === index + 1 ? `${item}` : `${item}, `
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelStoryCard
