const userMovieModel = require("../models/userMovieModel");

async function addFavorite(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const result = await userMovieModel.addFavorite(
            user_id,
            movie_id
        );

        return res.status(201).json({
            success: true,
            message: "Movie added to favorites.",
            favorite_id: result.insertId
        });

    } catch (error) {
        console.error("Error adding favorite:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Movie is already in favorites."
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                success: false,
                message: "Movie not found."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add movie to favorites."
        });
    }
}

async function removeFavorite(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const result = await userMovieModel.removeFavorite(
            user_id,
            movie_id
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie is not in favorites."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie removed from favorites."
        });

    } catch (error) {
        console.error("Error removing favorite:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove movie from favorites."
        });
    }
}

async function checkFavorite(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const isFavorite = await userMovieModel.isFavorite(
            user_id,
            movie_id
        );

        return res.status(200).json({
            success: true,
            isFavorite
        });

    } catch (error) {
        console.error("Error checking favorite:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to check favorite status."
        });
    }
}

async function getFavorites(req, res) {
    try {
        const user_id = req.user.user_id;

        const movies = await userMovieModel.getFavorites(user_id);

        return res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });

    } catch (error) {
        console.error("Error fetching favorites:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch favorites."
        });
    }
}

async function addToWatchlist(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const result = await userMovieModel.addToWatchlist(
            user_id,
            movie_id
        );

        return res.status(201).json({
            success: true,
            message: "Movie added to watchlist.",
            watchlist_id: result.insertId
        });

    } catch (error) {
        console.error("Error adding to watchlist:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Movie is already in watchlist."
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                success: false,
                message: "Movie not found."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add movie to watchlist."
        });
    }
}

async function removeFromWatchlist(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const result = await userMovieModel.removeFromWatchlist(
            user_id,
            movie_id
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie is not in watchlist."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie removed from watchlist."
        });

    } catch (error) {
        console.error("Error removing from watchlist:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove movie from watchlist."
        });
    }
}

async function checkWatchlist(req, res) {
    try {
        const user_id = req.user.user_id;
        const movie_id = Number(req.params.movieId);

        if (!Number.isInteger(movie_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id."
            });
        }

        const isInWatchlist = await userMovieModel.isInWatchlist(
            user_id,
            movie_id
        );

        return res.status(200).json({
            success: true,
            isInWatchlist
        });

    } catch (error) {
        console.error("Error checking watchlist:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to check watchlist status."
        });
    }
}

async function getWatchlist(req, res) {
    try {
        const user_id = req.user.user_id;

        const movies = await userMovieModel.getWatchlist(user_id);

        return res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });

    } catch (error) {
        console.error("Error fetching watchlist:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch watchlist."
        });
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    checkFavorite,
    getFavorites,
    addToWatchlist,
    removeFromWatchlist,
    checkWatchlist,
    getWatchlist
};