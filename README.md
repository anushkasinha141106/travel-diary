# Travel Journal - Full-Stack Memory Management Application

A robust full-stack web application designed for personal travel documentation. The project implements a secure, scalable architecture using the MERN stack (MongoDB, Express, React, Node.js) with a focus on portable asset management and state-of-the-art UI/UX patterns.

## Technical Stack

*   **Frontend**: React 19, Tailwind CSS, Framer Motion (for physics-based animations), Redux Toolkit (state management), Axios.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB Atlas (NoSQL).
*   **Authentication**: JWT (JSON Web Tokens) with secure HTTP-only cookie storage, Bcryptjs for password hashing.
*   **File Handling**: Multer for disk storage and multipart/form-data processing.

## Key Features

*   **Secure Authentication**: Comprehensive login and signup flows with encrypted session management.
*   **Portable Asset Management**: Implementation of relative pathing for uploaded assets, ensuring cross-environment compatibility (Local vs Production).
*   **Dynamic Story Management**: Full CRUD operations for travel stories, including location tagging and image integration.
*   **Interactive UI Components**: Responsive design with glassmorphic elements and high-performance animations.
*   **Custom Filtering**: Real-time search and date-range filtering for efficient data retrieval.

## Project Structure

```text
├── backend/            # Express server, controllers, routes, and models
├── frontend/           # React application (Vite-based)
├── package.json        # Root scripts for unified build/start
```

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/username/travel-diary.git
cd travel-diary-main
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
NODE_ENV=production
```

### 3. Build and Run
The project uses a unified script to manage both tiers:
```bash
# Install all dependencies and build frontend
npm install
npm run build

# Start the application
npm start
```

## Deployment Specifications (Render)

The application is optimized for a Single-Service model on Render.

*   **Root Directory**: Leave empty.
*   **Build Command**: `npm run build`
*   **Start Command**: `npm start`
*   **Environment Variables**: Ensure `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV=production` are set in the dashboard.

---

## Developer
Anushka
