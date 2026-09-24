const db = require("../config/db");

async function getAllMovies() {
    const [rows] = await db.execute(`
        select
            movie_id,
            title,
            tagline,
            release_date,
            runtime,
            description,
            poster_url,
            backdrop_url,
            imdb_rating,
            imdb_votes,
            status
        from movies
        order by release_date desc
    `);

    return rows;
}

async function searchMovies(searchTerm) {
    const [rows] = await db.execute(
        `
        select
            movie_id,
            title,
            tagline,
            release_date,
            runtime,
            description,
            poster_url,
            backdrop_url,
            imdb_rating,
            imdb_votes,
            status
        from movies
        where title like ?
        order by release_date desc
        `,
        [`%${searchTerm}%`]
    );

    return rows;
}

async function filterMovies({
    searchTerm = "",
    genre = "",
    language = "",
    year = "",
    rating = "",
    sortBy = ""
}) {
    let query = `
        select distinct
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
        from movies m
    `;

    const conditions = [];
    const values = [];

    if (genre) {
        query += `
            inner join movie_genres mg
                on m.movie_id = mg.movie_id
            inner join genres g
                on mg.genre_id = g.genre_id
        `;

        conditions.push("g.genre_name = ?");
        values.push(genre);
    }

    if (language) {
        query += `
            inner join movie_languages ml
                on m.movie_id = ml.movie_id
            inner join languages l
                on ml.language_id = l.language_id
        `;

        conditions.push("l.language_name = ?");
        values.push(language);
    }

    if (searchTerm) {
        conditions.push("m.title like ?");
        values.push(`%${searchTerm}%`);
    }

    if (year) {
        conditions.push("year(m.release_date) = ?");
        values.push(Number(year));
    }

    if (rating) {
        conditions.push("m.imdb_rating >= ?");
        values.push(Number(rating));
    }

    if (conditions.length > 0) {
        query += ` where ${conditions.join(" and ")}`;
    }

    switch (sortBy) {
        case "rating_desc":
            query += " order by m.imdb_rating desc";
            break;

        case "rating_asc":
            query += " order by m.imdb_rating asc";
            break;

        case "year_desc":
            query += " order by m.release_date desc";
            break;

        case "year_asc":
            query += " order by m.release_date asc";
            break;

        case "title_asc":
            query += " order by m.title asc";
            break;

        case "title_desc":
            query += " order by m.title desc";
            break;

        default:
            query += " order by m.release_date desc";
    }

    const [rows] = await db.execute(query, values);

    return rows;
}

async function getFilterOptions() {
    const [genreRows] = await db.execute(`
        select
            genre_id,
            genre_name
        from genres
        order by genre_name
    `);

    const [languageRows] = await db.execute(`
        select
            language_id,
            language_name
        from languages
        order by language_name
    `);

    const [yearRows] = await db.execute(`
        select distinct
            year(release_date) as year
        from movies
        where release_date is not null
        order by year desc
    `);

    return {
        genres: genreRows,
        languages: languageRows,
        years: yearRows.map(row => row.year),
        ratings: [5, 6, 7, 8],
        sortOptions: [
            {
                value: "rating_desc",
                label: "Highest Rating"
            },
            {
                value: "rating_asc",
                label: "Lowest Rating"
            },
            {
                value: "year_desc",
                label: "Newest"
            },
            {
                value: "year_asc",
                label: "Oldest"
            },
            {
                value: "title_asc",
                label: "Title A-Z"
            },
            {
                value: "title_desc",
                label: "Title Z-A"
            }
        ]
    };
}

async function getMovieById(movieId) {
    const [movieRows] = await db.execute(
        `
        select
            movie_id,
            title,
            tagline,
            release_date,
            runtime,
            description,
            poster_url,
            backdrop_url,
            imdb_rating,
            imdb_votes,
            status
        from movies
        where movie_id = ?
        `,
        [movieId]
    );

    if (movieRows.length === 0) {
        return null;
    }

    const [genreRows] = await db.execute(
        `
        select
            g.genre_id,
            g.genre_name
        from genres g
        inner join movie_genres mg
            on g.genre_id = mg.genre_id
        where mg.movie_id = ?
        order by g.genre_name
        `,
        [movieId]
    );

    const [languageRows] = await db.execute(
        `
        select
            l.language_id,
            l.language_name,
            l.language_code,
            ml.language_type
        from languages l
        inner join movie_languages ml
            on l.language_id = ml.language_id
        where ml.movie_id = ?
        order by l.language_name
        `,
        [movieId]
    );

    const [directorRows] = await db.execute(
        `
        select
            d.director_id,
            d.director_name
        from directors d
        inner join movie_directors md
            on d.director_id = md.director_id
        where md.movie_id = ?
        order by d.director_name
        `,
        [movieId]
    );

    const [trailerRows] = await db.execute(
        `
        select
            trailer_id,
            title,
            video_url,
            video_key,
            platform,
            trailer_type,
            published_at
        from trailers
        where movie_id = ?
        order by published_at desc
        `,
        [movieId]
    );

    return {
        ...movieRows[0],
        genres: genreRows,
        languages: languageRows,
        directors: directorRows,
        trailers: trailerRows
    };
}

module.exports = {
    getAllMovies,
    searchMovies,
    filterMovies,
    getMovieById,
    getFilterOptions
};