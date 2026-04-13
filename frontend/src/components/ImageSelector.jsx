import React, { useEffect, useRef, useState } from "react"
import { BsUpload } from "react-icons/bs"
import { MdDeleteOutline } from "react-icons/md"
import { motion } from "framer-motion"
import BASE_URL from "../config"

const ImageSelector = ({
  image,
  setImage,
  handleDeleteImage,
  charm,
  charmPosition,
  setCharmPosition,
}) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      setImage(file)
    }
  }

  const onChooseFile = () => {
    inputRef.current.click()
  }

  const handleRemoveImage = () => {
    setImage(null)
    handleDeleteImage()
  }

  useEffect(() => {
    // if the image prop is a string(url), set it as the preview URL
    if (typeof image === "string") {
      const fullUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;
      setPreviewUrl(fullUrl)
    } else if (image) {
      setPreviewUrl(URL.createObjectURL(image))
    } else {
      setPreviewUrl(null)
    }

    return () => {
      if (previewUrl && typeof previewUrl === "string" && !image && !previewUrl.startsWith("http") && !image?.startsWith?.("/uploads")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [image])

  // Get absolute charm URL
  const fullCharmUrl = charm?.startsWith("http") ? charm : `${BASE_URL}${charm}`;

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-sm border border-slate-200/50"
          onClick={() => onChooseFile()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-100 rounded-full border border-cyan-100">
            <BsUpload className="text-3xl font-bold text-cyan-500" />
          </div>

          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      ) : (
        <div className="w-full relative overflow-hidden rounded-lg">
          <img
            src={previewUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover"
          />

          {/* Draggable Charm Sticker */}
          {charm && (
            <motion.div
              drag
              dragMomentum={false}
              dragConstraints={{ left: 0, right: 300, top: 0, bottom: 250 }}
              initial={{ x: charmPosition.x, y: charmPosition.y }}
              onDragEnd={(event, info) => {
                setCharmPosition({
                  x: charmPosition.x + info.offset.x,
                  y: charmPosition.y + info.offset.y,
                })
              }}
              className="absolute cursor-move z-10"
              style={{ top: 0, left: 0 }}
            >
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-lg border border-white/50">
                <img
                  src={fullCharmUrl}
                  alt="Sticker"
                  className="w-16 h-16 object-contain pointer-events-none"
                />
              </div>
            </motion.div>
          )}

          <button
            className="btn-small btn-delete absolute top-2 right-2 z-20"
            onClick={handleRemoveImage}
          >
            <MdDeleteOutline className="text-xl" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageSelector
