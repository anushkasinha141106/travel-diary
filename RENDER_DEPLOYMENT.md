# Render Deployment Guide

Follow these steps to deploy your Travel Diary app.

## Backend (Web Service)
1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `MONGO_URI`: (Your MongoDB URI)
   - `JWT_SECRET`: (Your secret)
   - `BASE_URL`: (Your backend URL)
   - `FRONTEND_URL`: (Your frontend URL)
   - `NODE_ENV`: `production`

## Frontend (Static Site)
1. **Root Directory**: `frontend`
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: (Your backend URL)

---

### Changes I Made
- Fixed `travelStory.controller.js` bugs (typos and missing returns).
- Replaced hardcoded URLs with environment variables.
- Added automatic directory creation for `uploads`.
- Fixed the "Delete Story" button in the edit modal.
- Configured secure cookies for production.
