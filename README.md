# favorite-movies-manager
Full-stack web application for managing favorite movies and TV shows

🚀 Features
1) Add new movies/TV shows with detailed information
2) View all entries in a responsive table
3) Edit existing entries
4) Delete entries with confirmation
5) Infinite Scroll - automatically loads more data as you scroll
6) Search & Filter - by title, director, location, and type
7) Responsive Design - works on desktop and mobile

Tech Stack
Frontend
React (with Vite and TypeScript)
TailwindCSS for styling
Shadcn UI component library
React Hooks for state management

Backend
Node.js with Express
MySQL database
Prisma ORM
Zod for schema validation

📋 Prerequisites
Node.js (v18 or higher)
MySQL (v8.0 or higher)
npm or yarn

⚙️ Setup Instructions
Backend Setup
Navigate to backend directory
bash
cd backend
Install dependencies

bash
npm install
Environment Configuration
Create a .env file in the backend directory:

env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=4040
FRONTEND_URL="http://localhost:5173"

Database Setup

bash
# Create database
mysql -u root -p
CREATE DATABASE movies_db;
EXIT;

# Run Prisma migrations
npx prisma generate
npx prisma db push
Start Backend Server

bash
# Development
npm run dev

# Production
npm start
Backend will run on http://localhost:4040

Frontend Setup
Navigate to frontend directory

bash
cd frontend
Install dependencies

bash
npm install
Environment Configuration
Create a .env file in the frontend directory:

find constant folder in directory and check url
LOCAL_URL=http://localhost:4040/api
Start Frontend Development Server

bash
npm run dev
Frontend will run on http://localhost:5173
