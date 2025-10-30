const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

router.post('/movies', moviesController.createMovie);
router.get('/movies', moviesController.getAllMovies);
router.get('/movies/page/:page', moviesController.getAllMoviesWithPagination);
router.get('/movies/:id', moviesController.getMovieById);
router.put('/movies/:id', moviesController.updateMovie);
router.delete('/movies/:id', moviesController.deleteMovie);

module.exports = router;