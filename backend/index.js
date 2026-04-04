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
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Logging middleware for troubleshooting
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Static routes: Ensure these are at the top to catch asset requests
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/assets", express.static(path.join(__dirname, "assets")))

const frontendPath = path.join(__dirname, "../frontend/dist")
app.use(express.static(frontendPath))

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
    res.sendFile(path.join(frontendPath, "index.html"))
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
