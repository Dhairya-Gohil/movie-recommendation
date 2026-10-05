const movieModel = require("../models/movieModel");
const recommendationService = require("../services/recommendationService");

async function getRecommendations(req, res) {
    try {
        const movieId = Number(req.params.movie_id);
        const limit = Number(req.query.limit) || 10;

        if (!Number.isInteger(movieId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie id"
            });
        }

        if (limit < 1 || limit > 20) {
            return res.status(400).json({
                success: false,
                message: "Recommendation limit must be between 1 and 20"
            });
        }

        const movie = await movieModel.getMovieById(movieId);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        const movies = await movieModel.getAllMoviesWithMetadata();

        const recommendations =
            await recommendationService.getRecommendations(
                movies,
                movieId,
                limit
            );

        res.status(200).json({
            success: true,
            movie_id: movieId,
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.error(
            "Error generating recommendations:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate recommendations"
        });
    }
}

module.exports = {
    getRecommendations
};