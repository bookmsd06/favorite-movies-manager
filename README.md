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

Database Schema
Movies Table
sql
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('MOVIE', 'TV_SHOW') NOT NULL,
  director VARCHAR(255) NOT NULL,
  budget DECIMAL(15,2),
  location VARCHAR(255),
  duration INT,
  year_time INT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

Prisma Schema (if using Prisma)
prisma
model Movie {
  id        Int      @id @default(autoincrement())
  title     String
  type      String   // "MOVIE" or "TV_SHOW"
  director  String
  budget    Float?
  location  String?
  duration  Int?
  year_time Int?
  details   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

🌐 API Endpoints
Method	Endpoint	Description
GET	/api/movies	Get all movies with pagination
GET	/api/movies?page=1&limit=10	Get paginated movies
POST	/api/movies	Create new movie
PUT	/api/movies/:id	Update movie
DELETE	/api/movies/:id	Delete movie
GET	/api/movies/search	Search movies

🎯 Usage
Access the application at http://localhost:5173
Add new entries using the "Add New" button
Search and filter using the search bar and type filter
Scroll down to automatically load more entries
Edit or delete entries using action buttons
