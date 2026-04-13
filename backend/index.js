import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"
import fs from "fs"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.")
  })
  .catch((err) => {
    console.error("CRITICAL: MongoDB connection error!")
    console.error(err)
    // Don't exit here, might be a temporary network issue, 
    // but log it clearly so the user knows why auth fails.
  })

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Diagnostic logging for storage paths
const uploadsPath = path.join(__dirname, "uploads")
const assetsPath = path.join(__dirname, "assets")

// Create uploads directory if it doesn't exist (CRITICAL for Render)
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
  console.log("Created uploads directory at:", uploadsPath)
}

app.use("/uploads", express.static(uploadsPath))
app.use("/assets", express.static(assetsPath))

const frontendPath = path.resolve(__dirname, "../frontend/dist")

if (fs.existsSync(frontendPath)) {
  console.log(`Frontend found at: ${frontendPath}`)
  app.use(express.static(frontendPath))
} else {
  console.warn(`WARNING: Frontend dist folder NOT found at: ${frontendPath}`)
}

app.use(cookieParser())
app.use(express.json())

// Enable CORS: Be permissive for local dev and production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins for the moment to get you unblocked in production
      callback(null, true)
    },
    credentials: true,
  })
)

// API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// STATIC ASSETS & FRONTEND
const _frontendPath = path.resolve(__dirname, "../frontend/dist")

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/assets", express.static(path.join(__dirname, "assets")))
app.use(express.static(_frontendPath))

// Catch-all (must be the VERY bottom)
app.get("*", (req, res) => {
  const indexPath = path.join(_frontendPath, "index.html")
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    // Basic fallback if dist is missing
    if (req.path.startsWith("/api")) {
      res.status(404).json({ success: false, message: "API not found" })
    } else {
      res.status(404).send("Frontend dist folder not found.")
    }
  }
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 SYSTEM ERROR:", err.message)
  console.error(err.stack) // This will show the exact line in your Render logs
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({ success: false, statusCode, message })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`)
})
