import { fileURLToPath } from "url"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import { cloudinary } from "../multer.js"
import path from "path"
import fs from "fs"

export const addTravelStory = async (req, res, next) => {
  const { title, story, visitedLocation, imageUrl, visitedDate, charm, charmPosition } =
    req.body

  const userId = req.user.id

  //   validate required field
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
      charm,
      charmPosition,
    })

    await travelStory.save()

    res.status(201).json({
      story: travelStory,
      message: "You story is added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTravelStory = async (req, res, next) => {
  const userId = req.user.id

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavorite: -1,
    })

    res.status(200).json({ stories: travelStories })
  } catch (error) {
    next(error)
  }
}

export const imageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image uploaded"))
    }

    // Cloudinary returns the full URL in req.file.path
    const imageUrl = req.file.path

    res.status(201).json({ imageUrl })
  } catch (error) {
    next(error)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, "..")

export const deleteImage = async (req, res, next) => {
  const { imageUrl } = req.query

  if (!imageUrl) {
    return next(errorHandler(400, "imageUrl parameter is required!"))
  }

  try {
    if (imageUrl.includes("cloudinary.com")) {
      // Extract public_id from Cloudinary URL
      // Format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
      const parts = imageUrl.split("/")
      const filename = parts[parts.length - 1].split(".")[0]
      const folder = "travel-stories" // Should match the folder in multer.js
      const publicId = `${folder}/${filename}`

      await cloudinary.uploader.destroy(publicId)
      return res.status(200).json({ message: "Cloudinary image deleted successfully!" })
    }

    // Legacy local file deletion logic
    const filename = path.basename(imageUrl)
    const filePath = path.join(rootDir, "uploads", filename)

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
    }

    res.status(200).json({ message: "Image deleted successfully!" })
  } catch (error) {
    next(error)
  }
}

export const editTravelStory = async (req, res, next) => {
  const { id } = req.params
  const { title, story, visitedLocation, imageUrl, visitedDate, charm, charmPosition } =
    req.body
  const userId = req.user.id

  // validate required field
  if (!title || !story || !visitedLocation || !visitedDate) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel Story not found!"))
    }

    const placeholderImageUrl = `/assets/placeholderImage.png`

    travelStory.title = title
    travelStory.story = story
    travelStory.visitedLocation = visitedLocation
    travelStory.imageUrl = imageUrl || placeholderImageUrl
    travelStory.visitedDate = parsedVisitedDate
    travelStory.charm = charm || ""
    travelStory.charmPosition = charmPosition || { x: 0, y: 0 }

    await travelStory.save()

    res.status(200).json({
      story: travelStory,
      message: "Travel story updated successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTravelStory = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel Story not found!"))
    }

    // delete travel story from the database
    await travelStory.deleteOne({ _id: id, userId: userId })

    // Check if the image is not a placeholder before deleting
    const placeholderImageUrl = `/assets/placeholderImage.png`

    // Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl

    if (imageUrl && imageUrl !== placeholderImageUrl) {
      if (imageUrl.includes("cloudinary.com")) {
        const parts = imageUrl.split("/")
        const filename = parts[parts.length - 1].split(".")[0]
        const folder = "travel-stories"
        const publicId = `${folder}/${filename}`
        await cloudinary.uploader.destroy(publicId)
      } else {
        // Extract the filename from the image url
        const filename = path.basename(imageUrl)
        const filePath = path.join(rootDir, "uploads", filename)

        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
          // delete the file
          await fs.promises.unlink(filePath) // delete the file asynchronously
        }
      }
    }

    res.status(200).json({ message: "Travel story deleted successfully!" })
  } catch (error) {
    next(error)
  }
}

export const updateIsFavourite = async (req, res, next) => {
  const { id } = req.params
  const { isFavorite } = req.body
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel story not found!"))
    }

    travelStory.isFavorite = isFavorite

    await travelStory.save()

    res
      .status(200)
      .json({ story: travelStory, message: "Updated successfully!" })
  } catch (error) {
    next(error)
  }
}

export const searchTravelStory = async (req, res, next) => {
  const { query } = req.query
  const userId = req.user.id

  if (!query) {
    return next(errorHandler(404, "Query is required!"))
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavorite: -1 })

    res.status(200).json({
      stories: searchResults,
    })
  } catch (error) {
    next(error)
  }
}

export const filterTravelStories = async (req, res, next) => {
  const { startDate, endDate } = req.query
  const userId = req.user.id

  try {
    const start = new Date(parseInt(startDate))
    const end = new Date(parseInt(endDate))

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavorite: -1 })

    res.status(200).json({ stories: filteredStories })
  } catch (error) {
    next(error)
  }
}
