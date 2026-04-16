import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"
import fs from "fs"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"

const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB.")
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB connection error!")
    console.error(err)
  })

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsPath = path.join(__dirname, "uploads")
const assetsPath = path.join(__dirname, "assets")

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
  console.log("Created uploads directory at:", uploadsPath)
}

// MIDDLEWARE - Order matters!
app.use(cookieParser())
app.use(express.json())

// CORS - UPDATED to allow your Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://travel-diary-frontend-gamma.vercel.app/"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

// Static files
app.use("/uploads", express.static(uploadsPath))
app.use("/assets", express.static(assetsPath))

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(), 
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  })
})

// API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 SYSTEM ERROR:", err.message)
  console.error(err.stack)
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({ success: false, statusCode, message })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})