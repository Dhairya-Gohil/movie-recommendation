const pool = require("../config/db");

async function addFavorite(user_id, movie_id) {
    const [result] = await pool.execute(
        `
        insert into favorites (user_id, movie_id)
        values (?, ?)
        `,
        [user_id, movie_id]
    );

    return result;
}

async function removeFavorite(user_id, movie_id) {
    const [result] = await pool.execute(
        `
        delete from favorites
        where user_id = ? and movie_id = ?
        `,
        [user_id, movie_id]
    );

    return result;
}

async function isFavorite(user_id, movie_id) {
    const [rows] = await pool.execute(
        `
        select favorite_id
        from favorites
        where user_id = ? and movie_id = ?
        `,
        [user_id, movie_id]
    );

    return rows.length > 0;
}

async function getFavorites(user_id) {
    const [rows] = await pool.execute(
        `
        select
            m.movie_id,
            m.title,
            m.tagline,
            m.release_date,
            m.runtime,
            m.description,
            m.poster_url,
            m.backdrop_url,
            m.imdb_rating,
            m.imdb_votes,
            m.status
        from favorites f
        inner join movies m
            on f.movie_id = m.movie_id
        where f.user_id = ?
        order by f.created_at desc
        `,
        [user_id]
    );

    return rows;
}

async function addToWatchlist(user_id, movie_id) {
    const [result] = await pool.execute(
        `
        insert into watchlist (user_id, movie_id)
        values (?, ?)
        `,
        [user_id, movie_id]
    );

    return result;
}

async function removeFromWatchlist(user_id, movie_id) {
    const [result] = await pool.execute(
        `
        delete from watchlist
        where user_id = ? and movie_id = ?
        `,
        [user_id, movie_id]
    );

    return result;
}

async function isInWatchlist(user_id, movie_id) {
    const [rows] = await pool.execute(
        `
        select watchlist_id
        from watchlist
        where user_id = ? and movie_id = ?
        `,
        [user_id, movie_id]
    );

    return rows.length > 0;
}

async function getWatchlist(user_id) {
    const [rows] = await pool.execute(
        `
        select
            m.movie_id,
            m.title,
            m.tagline,
            m.release_date,
            m.runtime,
            m.description,
            m.poster_url,
            m.backdrop_url,
            m.imdb_rating,
            m.imdb_votes,
            m.status
        from watchlist w
        inner join movies m
            on w.movie_id = m.movie_id
        where w.user_id = ?
        order by w.created_at desc
        `,
        [user_id]
    );

    return rows;
}

module.exports = {
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorites,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlist
};