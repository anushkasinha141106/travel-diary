import React, { useState } from "react"
import { IoMdAdd, IoMdClose } from "react-icons/io"
import { MdOutlineDeleteOutline, MdOutlineUpdate } from "react-icons/md"
import DateSelector from "./DateSelector"
import ImageSelector from "./ImageSelector"
import TagInput from "./TagInput"
import axiosInstance from "../utils/axiosInstance"
import moment from "moment"
import { toast } from "react-toastify"
import uploadImage from "../utils/uploadImage"
import { motion } from "framer-motion"

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
  onDeleteClick,
}) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
  const [title, setTitle] = useState(storyInfo?.title || "")
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
  const [story, setStory] = useState(storyInfo?.story || "")
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  )

  const [error, setError] = useState("")
  const [charm, setCharm] = useState(storyInfo?.charm || "")

  const [charmPosition, setCharmPosition] = useState(
    storyInfo?.charmPosition || { x: 0, y: 0 }
  )

  const stickerOptions = [
    { url: "/assets/stickers/guitar.png", label: "Guitar" },
    { url: "/assets/stickers/disco.png", label: "Disco" },
    { url: "/assets/stickers/clapboard.png", label: "Clapboard" },
    { url: "/assets/stickers/vinyl.png", label: "Vinyl" },
    { url: "/assets/stickers/sunflowers.png", label: "Sunflowers" }
  ];

  const addNewTravelStory = async () => {
    try {
      let imageUrl = ""

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg)

        imageUrl = imgUploadRes.imageUrl || ""
      }

      const response = await axiosInstance.post("/travel-story/add", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        charm: charm || "",
        charmPosition: charmPosition,
      })

      if (response.data && response.data.story) {
        toast.success("Story added successfully!")

        getAllTravelStories()

        onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateTravelStory = async () => {
    const storyId = storyInfo._id

    try {
      let imageUrl = ""

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        charm: charm || "",
        charmPosition: charmPosition,
      }

      if (typeof storyImg === "object") {
        // Upload new image
        const imageUploadRes = await uploadImage(storyImg)

        imageUrl = imageUploadRes.imageUrl || ""

        postData = {
          ...postData,
          imageUrl: imageUrl,
        }
      }

      const response = await axiosInstance.post(
        "/travel-story/edit-story/" + storyId,
        postData
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")

        getAllTravelStories()

        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong! Please try again.")
      }
    }
  }

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!story) {
      setError("Please enter the story")
      return
    }

    setError("")

    if (type === "edit") {
      updateTravelStory()
    } else {
      addNewTravelStory()
    }
  }

  const handleDeleteStoryImage = async () => {
    // Deleting the image
    const deleteImageResponse = await axiosInstance.delete(
      "/travel-story/delete-image",
      {
        params: {
          imageUrl: storyInfo.imageUrl,
        },
      }
    )

    if (deleteImageResponse.data) {
      const storyId = storyInfo._id

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      }

      // updating story

      const response = await axiosInstance.post(
        "/travel-story/edit-story/" + storyId,
        postData
      )

      if (response.data) {
        toast.success("Story image deleted successfully")

        setStoryImg(null)

        getAllTravelStories()
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button class="btn-small" onClick={handleAddOrUpdateClick}>
                <IoMdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdOutlineUpdate className="text-lg" /> UPDATE STORY
                </button>

                <button className="btn-small btn-delete" onClick={onDeleteClick}>
                  <MdOutlineDeleteOutline className="text-lg" /> DELETE STORY
                </button>
              </>
            )}

            <button class="" onClick={onClose}>
              <IoMdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>

          <input
            type="text"
            className="text-2xl text-slate-900 outline-none"
            placeholder="Once Upon A Time..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImage={handleDeleteStoryImage}
            charm={charm}
            charmPosition={charmPosition}
            setCharmPosition={setCharmPosition}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>

            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>

            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>

          <div className="pt-5 pb-10 relative">
            <label className="input-label">SELECT A DECORATIVE CHARM</label>
            <div className="flex flex-wrap gap-5 mt-4 relative z-10">
              {stickerOptions.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title={option.label}
                  className={`p-1 rounded-2xl transition-all border-2 flex items-center justify-center ${
                    charm === option.url
                      ? "bg-cyan-100 border-[#05b6d3] shadow-lg shadow-cyan-200/50 -translate-y-1"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
                  }`}
                  onClick={() => setCharm(option.url === charm ? "" : option.url)}
                >
                  <img src={option.url} alt={option.label} className="w-12 h-12 object-contain" />
                </motion.button>
              ))}
            </div>

            {/* Subtle Floating Background Charms for context */}
            <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none select-none blur-sm animate-pulse">
              {charm && <img src={charm} className="w-40 h-40 object-contain" />}
            </div>
          </div>
        </div>
      </div>

      {/* Background Charms (Decorative) */}
      <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-10 flex flex-col gap-10 overflow-hidden h-full">
        <img src="/assets/stickers/disco.png" className="w-24 h-24 object-contain animate-bounce" />
        <img src="/assets/stickers/guitar.png" className="w-32 h-32 object-contain translate-x-10" />
        <img src="/assets/stickers/vinyl.png" className="w-20 h-20 object-contain -translate-x-5" />
      </div>
    </div>
  )
}

export default AddEditTravelStory
