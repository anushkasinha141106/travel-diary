# Travel Diary

A modern full-stack MERN travel journaling platform where users can document, organize, and personalize their travel experiences with an interactive and visually rich interface — validated across **70+ real user sessions**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://travel-diary-frontend-gamma.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://travel-diary-backend-pxxy.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/anushkasinha141106/travel-diary)

---

## Overview

**Travel Diary** allows users to create beautiful travel memories with cover images, visited location tags, custom decorative stickers, and story details — all inside a sleek glassmorphic interface.

Users can securely create an account, log in, upload travel stories, edit existing entries, and manage their entire personal travel collection from one place.

---

## By the Numbers

| Metric | Count |
|--------|-------|
| Real User Sessions | 70+ |
| RESTful API Endpoints | 14 |
| Reusable React Components | 12 |
| Core Interface Views | 5 |
| Mongoose Database Models | 2 |
| Backend Controllers | 3 |
| Technologies & Libraries | 25+ |

---

## Live Links

| Service | URL |
|---------|-----|
| Frontend | [travel-diary-frontend-gamma.vercel.app](https://travel-diary-frontend-gamma.vercel.app) |
| Backend | [travel-diary-backend-pxxy.onrender.com](https://travel-diary-backend-pxxy.onrender.com) |

---

## Features

### Authentication
- User signup and login with **JWT-protected routes**
- Passwords securely hashed via **Bcrypt.js**
- Persistent login state via **Redux-Persist**
- Sign out functionality

### Travel Story Management
- Full **CRUD** — create, edit, delete, and view stories
- **Advanced search and date-range filtering**
- Clean card-based story layout

### Story Customization
- Add title, description, and visited location tags
- Upload custom cover images
- Personalize with decorative stickers
- **Drag and reposition stickers interactively** on images
- Add dates to memories

### Media Handling
- Image upload via **Multer**
- Cloud storage and optimized CDN delivery via **Cloudinary** — completely decoupled from MongoDB
- Custom image previews

### UI / UX
- Modern **glassmorphic** interface
- Fully responsive for desktop and mobile
- Interactive cards, modals, and smooth **Framer Motion** animations
- Private route protection across all authenticated views

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | React (Vite) |
| State Management | Redux Toolkit + Redux-Persist |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Routing | React Router DOM |

### Backend

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Bcrypt.js |
| File Upload | Multer + Cloudinary |
| Session | Cookie-Parser |

### Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## Architecture Highlights

- **14 REST API endpoints** across **3 backend controllers** (Auth, User, Story) — every route JWT-protected
- **2 Mongoose schemas** modeling complex User-Story relationships for efficient querying
- **12 custom React components** across **5 private-routed views** (Landing, Login, SignUp, Home, ViewTravelStory)
- Images stored on **Cloudinary** entirely separate from MongoDB for a lean, performant database
- **Redux-Persist** ensures session state survives page reloads without re-authentication

---

## Folder Structure
frontend/
├── src/
│   ├── components/      # 12 reusable React components
│   ├── pages/           # 5 core interface views
│   ├── redux/           # Redux Toolkit + Redux-Persist store
│   ├── utils/
│   └── assets/
backend/
├── controllers/         # 3 controllers: Auth, User, Story
├── routes/              # 14 REST API endpoints
├── models/              # 2 Mongoose schemas: User, TravelStory
├── middleware/
├── utils/
└── uploads/

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
git clone https://github.com/anushkasinha141106/travel-diary.git
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

---

## Future Improvements

- Map integration for visited travel locations
- "Remember When" — revisit past memories through highlights
- Story categories and tags
- Dark mode support
- AI-generated travel captions
- Multi-image galleries per story
- Personalized photobooth-style grid on the home page

---

## Author

**Anushka Sinha**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/anushka-sinha-36645033b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/anushkasinha141106)
