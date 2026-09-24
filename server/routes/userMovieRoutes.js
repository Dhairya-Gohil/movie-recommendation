const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const userMovieController = require("../controllers/userMovieController");

const router = express.Router();

router.use(authenticate);

// favorites
router.get("/favorites", userMovieController.getFavorites);

router.get(
    "/favorites/:movieId",
    userMovieController.checkFavorite
);

router.post(
    "/favorites/:movieId",
    userMovieController.addFavorite
);

router.delete(
    "/favorites/:movieId",
    userMovieController.removeFavorite
);

// watchlist
router.get("/watchlist", userMovieController.getWatchlist);

router.get(
    "/watchlist/:movieId",
    userMovieController.checkWatchlist
);

router.post(
    "/watchlist/:movieId",
    userMovieController.addToWatchlist
);

router.delete(
    "/watchlist/:movieId",
    userMovieController.removeFromWatchlist
);

module.exports = router;