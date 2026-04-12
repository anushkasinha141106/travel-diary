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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white z-20">
        <h5 className="text-xl font-bold text-stone-800 uppercase tracking-widest">
          {type === "add" ? "New Memory" : "Edit Memory"}
        </h5>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors" onClick={onClose}>
          <IoMdClose className="text-2xl text-stone-400" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide py-4">

        <div className="flex flex-1 flex-col gap-2 pt-4 pb-24">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-stone-900 outline-none font-bold placeholder:text-stone-300"
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

          <div className="flex flex-col gap-2 mt-6">
            <label className="input-label">YOUR STORY</label>
            <textarea
              className="text-sm text-stone-800 outline-none bg-stone-50 p-4 rounded-xl border border-stone-100 focus:border-stone-200 transition-all italic leading-relaxed"
              placeholder="Start writing your memory..."
              rows={8}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <div className="pt-6">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>

          <div className="pt-8 relative">
            <label className="input-label">SELECT A DECORATIVE CHARM</label>
            <div className="flex flex-wrap gap-4 mt-4 relative z-10">
              {stickerOptions.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title={option.label}
                  className={`p-1.5 rounded-2xl transition-all border-2 flex items-center justify-center ${
                    charm === option.url
                      ? "bg-[#f3f1ed] border-[#8e826b] shadow-md -translate-y-1"
                      : "bg-white border-stone-100 hover:border-stone-200"
                  }`}
                  onClick={() => setCharm(option.url === charm ? "" : option.url)}
                >
                  <img src={option.url} alt={option.label} className="w-12 h-12 object-contain" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">

        <div className="flex items-center gap-3">
          {type === "edit" && (
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 font-bold text-xs uppercase tracking-widest transition-all" onClick={onDeleteClick}>
              <MdOutlineDeleteOutline className="text-lg" /> Delete
            </button>
          )}
          {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2 text-stone-400 hover:text-stone-800 font-bold text-xs uppercase tracking-widest transition-all" onClick={onClose}>
            Cancel
          </button>
          <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-stone-800 text-white hover:bg-stone-900 shadow-xl shadow-stone-800/20 font-bold text-sm uppercase tracking-[0.15em] transition-all" onClick={handleAddOrUpdateClick}>
            {type === "add" ? <IoMdAdd className="text-xl" /> : <MdOutlineUpdate className="text-xl" />}
            {type === "add" ? "Save Memory" : "Update Memory"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelStory
