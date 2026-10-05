const reviewModel = require("../models/reviewModel");

const AI_SERVICE_URL = "http://127.0.0.1:8000";

async function analyzeSentiment(review_text) {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/sentiment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: review_text
            })
        });

        if (!response.ok) {
            throw new Error("AI sentiment service failed.");
        }

        const data = await response.json();

        if (!data.success || !data.result) {
            throw new Error("Invalid sentiment response.");
        }

        return {
            sentiment: data.result.sentiment,
            sentiment_score: data.result.score
        };
    } catch (error) {
        console.error("Sentiment analysis error:", error);

        return {
            sentiment: null,
            sentiment_score: null
        };
    }
}

function validateRating(rating) {
    const numericRating = Number(rating);

    if (
        !Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        return null;
    }

    // Allow only 0.5 increments.
    if ((numericRating * 2) % 1 !== 0) {
        return null;
    }

    return numericRating;
}

async function addReview(req, res) {
    try {
        const user_id = req.user.user_id;

        const { movie_id, review_text, rating } = req.body;

        if (!movie_id || !review_text || !review_text.trim() || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Movie ID, review text, and rating are required."
            });
        }

        const ratingVal = Number(rating);
        if (isNaN(ratingVal) || ratingVal < 0 || ratingVal > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 0 and 5."
            });
        }

        const cleanedReviewText = review_text.trim();

        const sentimentResult = await analyzeSentiment(
            cleanedReviewText
        );

        const result = await reviewModel.addReview(
            user_id,
            movie_id,
            cleanedReviewText,
            ratingVal,
            sentimentResult.sentiment,
            sentimentResult.sentiment_score
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully.",
            review_id: result.insertId,
            rating: ratingVal,
            sentiment: sentimentResult.sentiment,
            sentiment_score: sentimentResult.sentiment_score
        });
    } catch (error) {
        console.error("Error adding review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add review."
        });
    }
}

async function getReviewsByMovie(req, res) {
    try {
        const { movieId } = req.params;

        const reviews = await reviewModel.getReviewsByMovie(movieId);

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews."
        });
    }
}

async function updateReview(req, res) {
    try {
        const user_id = req.user.user_id;
        const { reviewId } = req.params;

        const { review_text, rating } = req.body;

        if (!review_text || !review_text.trim() || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "Review text and rating are required."
            });
        }

        const ratingVal = Number(rating);
        if (isNaN(ratingVal) || ratingVal < 0 || ratingVal > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 0 and 5."
            });
        }

        const cleanedReviewText = review_text.trim();

        const sentimentResult = await analyzeSentiment(
            cleanedReviewText
        );

        const result = await reviewModel.updateReview(
            reviewId,
            user_id,
            cleanedReviewText,
            ratingVal,
            sentimentResult.sentiment,
            sentimentResult.sentiment_score
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Review not found or you are not allowed to edit it."
            });
        }

        res.json({
            success: true,
            message: "Review updated successfully.",
            rating: ratingVal,
            sentiment: sentimentResult.sentiment,
            sentiment_score: sentimentResult.sentiment_score
        });
    } catch (error) {
        console.error("Error updating review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update review."
        });
    }
}

async function deleteReview(req, res) {
    try {
        const user_id = req.user.user_id;
        const { reviewId } = req.params;

        const result = await reviewModel.deleteReview(
            reviewId,
            user_id
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Review not found or you are not allowed to delete it."
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete review."
        });
    }
}

module.exports = {
    addReview,
    getReviewsByMovie,
    updateReview,
    deleteReview
};