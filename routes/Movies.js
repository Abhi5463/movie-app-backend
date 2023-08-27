const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');


router.get('/movies', async (req, res) => {
    const { query } = req.query;
    console.log('Search query:', query);
    try {
      let movies;
      if (query) {
        console.log('Search query:', query); 
        movies = await Movie.find({ title: { $regex: query, $options: 'i' } });
      } else {
        movies = await Movie.find();
      }
    //   console.log('Matching movies:', movies); 
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Fetch movie by ID
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new movie
router.post('/movies', async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update movie details
router.put('/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete a movie
router.delete('/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
