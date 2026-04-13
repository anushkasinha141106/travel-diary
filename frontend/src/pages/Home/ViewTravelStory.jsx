import React from "react"
import { IoMdClose } from "react-icons/io"
import { MdOutlineDelete, MdOutlineUpdate } from "react-icons/md"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import BASE_URL from "../../config"

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdOutlineUpdate className="text-lg" /> UPDATE STORY
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdOutlineDelete className="text-lg" /> DELETE STORY
            </button>

            <button className="cursor-pointer" onClick={onClose}>
              <IoMdClose className="text-lg text-slate-400" />
            </button>
          </div>
        </div>
      </div>



      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">
            {storyInfo && storyInfo.title}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded-sm px-2 py-1">
              <FaLocationDot className="text-sm" />

              {storyInfo &&
                storyInfo.visitedLocation.map((item, index) =>
                  storyInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item},`
                )}
            </div>
          </div>
        </div>

      <div className="relative overflow-hidden md:rounded-2xl">
        <img
          src={storyInfo && (storyInfo.imageUrl?.startsWith("http") ? storyInfo.imageUrl : `${BASE_URL}${storyInfo.imageUrl}`)}
          alt="story image"
          className="w-full h-[250px] md:h-[400px] object-cover"
        />

        {/* Decorative Charm Sticker Over Image */}
        {storyInfo && storyInfo.charm && (
          <div
            className="absolute bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-white/50 z-10 transition-transform hover:scale-110"
            style={{
              left: `${storyInfo.charmPosition?.x || 0}px`,
              top: `${storyInfo.charmPosition?.y || 0}px`,
            }}
          >
            <img
              src={storyInfo.charm?.startsWith("http") ? storyInfo.charm : `${BASE_URL}${storyInfo.charm}`}
              alt="charm"
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo.story}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ViewTravelStory
