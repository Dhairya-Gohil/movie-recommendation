const pool = require("../config/db");

async function addReview(
    user_id,
    movie_id,
    review_text,
    sentiment,
    sentiment_score
) {
    const [result] = await pool.execute(
        `
        insert into reviews(
    user_id,
    movie_id,
    review_text,
    sentiment,
    sentiment_score
)
values(?, ?, ?, ?, ?)
    `,
        [
            user_id,
            movie_id,
            review_text,
            sentiment,
            sentiment_score
        ]
    );

    return result;
}

async function getReviewsByMovie(movie_id) {
    const [rows] = await pool.execute(
        `
select
r.review_id,
    r.user_id,
    r.movie_id,
    r.review_text,
    r.sentiment,
    r.sentiment_score,
    r.created_at,
    r.updated_at,
    u.full_name
        from reviews r
        inner join users u
            on r.user_id = u.user_id
        where r.movie_id = ?
    order by r.created_at desc
        `,
        [movie_id]
    );

    return rows;
}

async function getReviewById(review_id) {
    const [rows] = await pool.execute(
        `
select
review_id,
    user_id,
    movie_id,
    review_text,
    sentiment,
    sentiment_score,
    created_at,
    updated_at
        from reviews
        where review_id = ?
    `,
        [review_id]
    );

    return rows[0];
}

async function updateReview(
    review_id,
    user_id,
    review_text,
    sentiment,
    sentiment_score
) {
    const [result] = await pool.execute(
        `
        update reviews
set
review_text = ?,
    sentiment = ?,
    sentiment_score = ?
        where review_id = ? and user_id = ?
            `,
        [
            review_text,
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
        delete from reviews
        where review_id = ? and user_id = ?
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
