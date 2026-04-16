# Travel Diary Application
[https://travel-diary-frontend-gamma.vercel.app](https://travel-diary-frontend-gamma.vercel.app)

A modern full-stack travel journaling platform where users can document, organize, and personalize their travel experiences with an interactive and visually rich interface.

## Live Demo

Frontend: [https://travel-diary-frontend-gamma.vercel.app](https://travel-diary-frontend-gamma.vercel.app)
Backend: [https://travel-diary-backend-pxxy.onrender.com](https://travel-diary-backend-pxxy.onrender.com)

---

## Overview

Travel Diary allows users to create beautiful travel memories with images, visited locations, custom decorative stickers, and story details — all inside a sleek glassmorphic user interface.

Users can securely create an account, log in, upload travel stories, edit existing entries, and manage their personal travel collection.

---

## Features

### Authentication

* User signup and login
* Secure authentication flow
* Persistent login state
* Sign out functionality

### Travel Story Management

* Create new travel stories
* Edit existing stories
* Delete travel stories
* View all saved travel stories
* Search and filter stories
* View story details in a clean card-based layout

### Story Customization

* Add a title and description for each story
* Add visited locations using location tags
* Personalize stories with decorative stickers
* Drag and position stickers interactively on images
* Add dates to memories
* Upload and display custom cover images

### Media Handling

* Image upload support
* Cloudinary integration for storing uploaded images
* Optimized cloud image delivery
* Support for custom image previews

### UI / UX

* Modern glassmorphic interface
* Responsive design for desktop and mobile
* Interactive cards and modals
* Smooth user experience with clean navigation
* Decorative sticker system for personalization
* Attractive travel memory layout

---

## Tech Stack

### Frontend

* React
* Vite
* Redux Toolkit
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cookie Parser
* Multer
* Cloudinary

### Deployment

* Frontend hosted on Vercel
* Backend hosted on Render
* Database hosted on MongoDB Atlas

---

## Folder Structure

```bash
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── utils/
│   └── assets/

backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
└── uploads/
```

---

## Environment Variables

### Frontend

```env
VITE_API_URL=https://your-backend-url/api
```

### Backend

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://your-frontend-url
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/travel-diary.git
cd travel-diary
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```


## Future Improvements

* Map integration for travel locations
* "Remember When" feature to revisit past travel memories through highlights
* Story categories and tags
* Dark mode support
* AI-generated travel captions
* Multi-image galleries per story
* Personalised home page ui similar to photobooth grid on login page

---

## Author

Anushka Sinha
