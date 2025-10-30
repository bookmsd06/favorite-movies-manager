const express = require('express');
const cors = require('cors');
const moviesRoutes = require('./routes/moviesRoutes');
const errorHandler = require('./utils/errorHandler');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 4040;

// here we add allowed origin with local one and live one
const allowedOrigin = {
    origin: [
        "http://localhost:5173",
        "https://movies-app-frontend.vercel.app",
        "http://movies-app-frontend.vercel.app",
    ],
}

app.use(cors(allowedOrigin));
app.use(express.json());

app.use('/api', moviesRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));