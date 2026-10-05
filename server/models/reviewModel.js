const pool = require("../config/db");

async function addReview(
    user_id,
    movie_id,
    review_text,
    rating,
    sentiment,
    sentiment_score
) {
    const [result] = await pool.execute(
        `
        INSERT INTO reviews(
            user_id,
            movie_id,
            review_text,
            rating,
            sentiment,
            sentiment_score
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            movie_id,
            review_text,
            rating,
            sentiment,
            sentiment_score
        ]
    );

    return result;
}

async function getReviewsByMovie(movie_id) {
    const [rows] = await pool.execute(
        `
        SELECT
            r.review_id,
            r.user_id,
            r.movie_id,
            r.review_text,
            r.rating,
            r.sentiment,
            r.sentiment_score,
            r.created_at,
            r.updated_at,
            u.full_name
        FROM reviews r
        INNER JOIN users u
            ON r.user_id = u.user_id
        WHERE r.movie_id = ?
        ORDER BY r.created_at DESC
        `,
        [movie_id]
    );

    return rows;
}

async function getReviewById(review_id) {
    const [rows] = await pool.execute(
        `
        SELECT
            review_id,
            user_id,
            movie_id,
            review_text,
            rating,
            sentiment,
            sentiment_score,
            created_at,
            updated_at
        FROM reviews
        WHERE review_id = ?
        `,
        [review_id]
    );

    return rows[0];
}

async function updateReview(
    review_id,
    user_id,
    review_text,
    rating,
    sentiment,
    sentiment_score
) {
    const [result] = await pool.execute(
        `
        UPDATE reviews
        SET
            review_text = ?,
            rating = ?,
            sentiment = ?,
            sentiment_score = ?
        WHERE review_id = ?
          AND user_id = ?
        `,
        [
            review_text,
            rating,
            sentiment,
            sentiment_score,
            review_id,
            user_id
        ]
    );

    return result;
}

async function deleteReview(review_id, user_id) {
    const [result] = await pool.execute(
        `
        DELETE FROM reviews
        WHERE review_id = ?
          AND user_id = ?
        `,
        [review_id, user_id]
    );

    return result;
}

module.exports = {
    addReview,
    getReviewsByMovie,
    getReviewById,
    updateReview,
    deleteReview
};