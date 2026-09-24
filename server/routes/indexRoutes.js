const express = require("express");

const authRoutes = require("./authRoutes");

const movieRoutes = require("./movieRoutes");

const userMovieRoutes = require("./userMovieRoutes");

const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/movies", movieRoutes);

router.use("/user-movies", userMovieRoutes);

router.use("/reviews", reviewRoutes);

module.exports = router;