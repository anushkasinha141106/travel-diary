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

app.use("/uploads", express.static(uploadsPath))
app.use("/assets", express.static(assetsPath))

const frontendPath = path.resolve(__dirname, "../frontend/dist")

if (fs.existsSync(frontendPath)) {
  console.log(`Frontend found at: ${frontendPath}`)
  app.use(express.static(frontendPath))
} else {
  console.warn(`WARNING: Frontend dist folder NOT found at: ${frontendPath}`)
}

// Enable CORS: Be permissive in production if FRONTEND_URL is missing
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(",") 
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "production") {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// Catch-all (must be the VERY bottom)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(frontendPath, "index.html")
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(404).send("Frontend not built. Please run 'npm run build' in the root directory.")
    }
  }
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({ success: false, statusCode, message })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`)
})
