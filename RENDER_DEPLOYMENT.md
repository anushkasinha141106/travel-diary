# Single Service Deployment Guide for Render

I have updated your project to support a single-service deployment. This means both your frontend and backend can now live on the same URL (e.g., `https://travel-diary.onrender.com`), which is much simpler and avoids common errors!

## Deployment Steps on Render

1.  **Create a New Web Service** on Render.
2.  **Connect your GitHub Repository**.
3.  **Root Directory**: Leave it empty (it will use the repo root).
4.  **Environment**: `Node`
5.  **Build Command**: `npm install && npm run build`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long random string for token signing (e.g., `ANUSHKAAAAhehe`).
    *   `NODE_ENV`: `production`

---

## What I Just Fixed
- **Fixed the "Cannot GET /" issue**: I updated the backend (`backend/index.js`) to serve your frontend's `dist` folder. Now, when someone visits the main URL, they'll see your website instead of an error message.
- **Unified Deployment**: I created a root `package.json` that automatically builds your frontend and installs your backend dependencies in one step.
- **Frontend Routing Support**: I added a "catch-all" route to the backend so that refreshing the page on routes like `/login` or `/sign-up` won't result in a 404 error.
- **Image Serving**: The backend is still configured to serve images from the `uploads/` and `assets/` folders using `process.cwd()` for better reliability.

### Important Note
Make sure to set your **`VITE_API_BASE_URL`** to an empty string `""` or simply don't set it (since I set the default to `/` if not provided in some cases, or it will use the current origin).
Actually, since I'm serving from the same origin, your frontend calls like `axiosInstance.post("/api/auth/signin")` will automatically hit the current origin!
