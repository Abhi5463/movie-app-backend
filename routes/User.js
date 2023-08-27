const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Movie = require("../models/Movie");
const jwt = require("jsonwebtoken");
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require("../middleware/vaidations/user");
const router = express.Router();
// const { verifyToken } = require('../middleware/auth')

router.post(
  "/create-user",
  validateUserSignUp,
  userVlidation,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      const newEmail = await User.isEmailInUse(email);
      if (newEmail) {
        return res.json({ success: false, message: "Email already exists" });
      }
      const user = User({
        username,
        email,
        password,
      });
      await user.save();
      return res.json({ success: true, user: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
);

router.post("/signIn", validateUserSignIn, userVlidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user === null)
      res.json({ success: false, message: "Enter a valid email/password" });

    const result = await user.comparePassword(password);
    if (!result)
      res.json({ success: false, message: "Enter a valid email/password" });
    else {
      const token = jwt.sign({ userId: user._id }, "secret", {
        expiresIn: "1d",
      });
      res.json({ success: true, user, token });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

router.post("/like/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (!user.likedMovies) {
      user.likedMovies = [];
    }

    if (user.likedMovies.includes(movieId)) {
      return res
        .status(400)
        .json({ success: false, message: "Movie already liked by user!" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found!" });
    }
    await User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { likedMovies: movie } },
      { new: true }
    );
  } catch (error) {
    res.json({ success: false, message: "error liking this movie" });
  }
});

router.post("/watchlist/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    console.log(`form watchlist/movieId: ${movieId},  userId: ${userId}`);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (!user.watchlist) {
      user.watchlist = [];
    }
   
    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: `Movie already added to watchlist! : ${error.message}`,
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { watchlist: movie } },
      { new: true }
    );
  } catch (error) {
    res.json({
      success: false,
      message: `error adding this movie to watchlist: ${error.message}`,
    });
  }
});

router.get("/watchlist/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate('watchlist');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.json({
      success: false,
      message: `error fetching watchlist: ${error.message}`,
    });
  }
});

router.get("/liked-movies/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate('likedMovies');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.json({ likedMovies: user.likedMovies });
  } catch (error) {
    res.json({
      success: false,
      message: `error fetching watchlist: ${error.message}`,
    });
  }
});

module.exports = router;
