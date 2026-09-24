const movieModel = require("../models/movieModel");

async function getAllMovies(req, res) {
    try {
        const movies = await movieModel.getAllMovies();

        res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });
    } catch (error) {
        console.error("Error fetching movies:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movies"
        });
    }
}

async function searchMovies(req, res) {
    try {
        const searchTerm = req.query.q?.trim();

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: "Search term is required"
            });
        }

        const movies = await movieModel.searchMovies(searchTerm);

        res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });
    } catch (error) {
        console.error("Error searching movies:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search movies"
        });
    }
}

async function filterMovies(req, res) {
    try {
        const {
            q = "",
            genre = "",
            language = "",
            year = "",
            rating = "",
            sortBy = ""
        } = req.query;

        const movies = await movieModel.filterMovies({
            searchTerm: q.trim(),
            genre: genre.trim(),
            language: language.trim(),
            year: year.trim(),
            rating: rating.trim(),
            sortBy: sortBy.trim()
        });

        res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });
    } catch (error) {
        console.error("Error filtering movies:", error);

        res.status(500).json({
            success: false,
            message: "Failed to filter movies"
        });
    }
}

async function getMovieById(req, res) {
    try {
        const movieId = Number(req.params.id);

        if (!Number.isInteger(movieId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id"
            });
        }

        const movie = await movieModel.getMovieById(movieId);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            movie
        });
    } catch (error) {
        console.error("Error fetching movie:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movie"
        });
    }
}

async function getFilterOptions(req, res) {
    try {
        const options = await movieModel.getFilterOptions();

        res.status(200).json({
            success: true,
            options
        });
    } catch (error) {
        console.error("Error fetching filter options:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch filter options"
        });
    }
}

module.exports = {
    getAllMovies,
    searchMovies,
    filterMovies,
    getMovieById,
    getFilterOptions
};