const express = require("express");

const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/", movieController.getAllMovies);

router.get("/search", movieController.searchMovies);

router.get("/filter", movieController.filterMovies);

router.get("/options", movieController.getFilterOptions);

router.get("/:id", movieController.getMovieById);

module.exports = router;