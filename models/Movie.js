const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  imageUrl: { type: String },
  // Add more fields as needed
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
