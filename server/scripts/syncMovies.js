const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const db = require("../config/db");

const csvDirectory = path.join(
    __dirname,
    "../../database/excel"
);

function readCsvFile(fileName) {
    const filePath = path.join(csvDirectory, fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    return parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true
    });
}

function resolveBraveUrl(url) {
    if (!url || !url.startsWith("https://imgs.search.brave.com/")) return url;

    const marker = "/g:ce/";
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) return url;

    try {
        let base64Part = url.substring(markerIndex + marker.length);
        base64Part = base64Part.replace(/\//g, '');
        const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
        if (decoded.startsWith("http")) {
            return decoded;
        }
    } catch (e) { }

    return url;
}

function normalizeValue(value) {
    if (value === undefined || value === "" || value === "NA" || value === "N/A") {
        return null;
    }

    return value;
}

function normalizeDate(value) {
    const val = normalizeValue(value);
    if (!val) return val;
    // Handle DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
        const parts = val.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return val;
}

async function syncMovies() {
    let connection;

    try {
        console.log("=================================");
        console.log("Movie dataset synchronization");
        console.log("=================================");

        connection = await db.getConnection();

        await connection.beginTransaction();
        await connection.execute("SET FOREIGN_KEY_CHECKS=0;");

        /*
         * =========================================
         * 1. READ CSV FILES
         * =========================================
         */

        console.log("\nReading CSV files...");

        const movies = readCsvFile("movies.csv");
        const genres = readCsvFile("genres.csv");
        const movieGenres = readCsvFile("movie_genres.csv");
        const languages = readCsvFile("languages.csv");
        const movieLanguages = readCsvFile("movie_languages.csv");
        const directors = readCsvFile("directors.csv");
        const movieDirectors = readCsvFile("movie_directors.csv");
        const trailers = readCsvFile("trailers.csv");
        const actors = readCsvFile("actors.csv");
        const movieCast = readCsvFile("movie_cast.csv");

        console.log(`Movies: ${movies.length}`);
        console.log(`Genres: ${genres.length}`);
        console.log(`Movie genres: ${movieGenres.length}`);
        console.log(`Languages: ${languages.length}`);
        console.log(`Movie languages: ${movieLanguages.length}`);
        console.log(`Directors: ${directors.length}`);
        console.log(`Movie directors: ${movieDirectors.length}`);
        console.log(`Trailers: ${trailers.length}`);
        console.log(`Actors: ${actors.length}`);
        console.log(`Movie cast: ${movieCast.length}`);

        /*
         * =========================================
         * 2. MOVIES
         * =========================================
         */

        console.log("\nSyncing movies...");

        for (const movie of movies) {
            await connection.execute(
                `
                insert into movies (
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
                )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                on duplicate key update
                    title = values(title),
                    tagline = values(tagline),
                    release_date = values(release_date),
                    runtime = values(runtime),
                    description = values(description),
                    poster_url = values(poster_url),
                    backdrop_url = values(backdrop_url),
                    imdb_rating = values(imdb_rating),
                    imdb_votes = values(imdb_votes),
                    status = values(status)
                `,
                [
                    normalizeValue(movie.movie_id),
                    normalizeValue(movie.title),
                    normalizeValue(movie.tagline),
                    normalizeDate(movie.release_date),
                    normalizeValue(movie.runtime),
                    normalizeValue(movie.description),
                    normalizeValue(movie.poster_url),
                    normalizeValue(movie.backdrop_url),
                    normalizeValue(movie.imdb_rating),
                    normalizeValue(movie.imdb_votes),
                    normalizeValue(movie.status)
                ]
            );
        }

        /*
         * =========================================
         * 3. GENRES
         * =========================================
         */

        console.log("Syncing genres...");

        for (const genre of genres) {
            await connection.execute(
                `
                insert into genres (
                    genre_id,
                    genre_name
                )
                values (?, ?)
                on duplicate key update
                    genre_name = values(genre_name)
                `,
                [
                    normalizeValue(genre.genre_id),
                    normalizeValue(genre.genre_name)
                ]
            );
        }

        /*
         * =========================================
         * 4. MOVIE GENRES
         * =========================================
         */

        console.log("Syncing movie genres...");

        for (const relation of movieGenres) {
            await connection.execute(
                `
                insert ignore into movie_genres (
                    movie_id,
                    genre_id
                )
                values (?, ?)
                `,
                [
                    normalizeValue(relation.movie_id),
                    normalizeValue(relation.genre_id)
                ]
            );
        }

        /*
         * =========================================
         * 5. LANGUAGES
         * =========================================
         */

        console.log("Syncing languages...");

        for (const language of languages) {
            await connection.execute(
                `
                insert into languages (
                    language_id,
                    language_name,
                    language_code
                )
                values (?, ?, ?)
                on duplicate key update
                    language_name = values(language_name),
                    language_code = values(language_code)
                `,
                [
                    normalizeValue(language.language_id),
                    normalizeValue(language.language_name),
                    normalizeValue(language.language_code)
                ]
            );
        }

        /*
         * =========================================
         * 6. MOVIE LANGUAGES
         * =========================================
         */

        console.log("Syncing movie languages...");

        for (const relation of movieLanguages) {
            await connection.execute(
                `
                insert into movie_languages (
                    movie_id,
                    language_id,
                    language_type
                )
                values (?, ?, ?)
                on duplicate key update
                    language_type = values(language_type)
                `,
                [
                    normalizeValue(relation.movie_id),
                    normalizeValue(relation.language_id),
                    normalizeValue(relation.language_type)
                ]
            );
        }

        /*
         * =========================================
         * 7. DIRECTORS
         * =========================================
         */

        console.log("Syncing directors...");

        for (const director of directors) {
            await connection.execute(
                `
                insert into directors (
                    director_id,
                    director_name
                )
                values (?, ?)
                on duplicate key update
                    director_name = values(director_name)
                `,
                [
                    normalizeValue(director.director_id),
                    normalizeValue(director.director_name)
                ]
            );
        }

        /*
         * =========================================
         * 8. MOVIE DIRECTORS
         * =========================================
         */

        console.log("Syncing movie directors...");

        for (const relation of movieDirectors) {
            await connection.execute(
                `
                insert ignore into movie_directors (
                    movie_id,
                    director_id
                )
                values (?, ?)
                `,
                [
                    normalizeValue(relation.movie_id),
                    normalizeValue(relation.director_id)
                ]
            );
        }

        /*
         * =========================================
         * 9. TRAILERS
         * =========================================
         */

        console.log("Syncing trailers...");

        for (const trailer of trailers) {
            await connection.execute(
                `
                insert into trailers (
                    trailer_id,
                    movie_id,
                    title,
                    video_url,
                    video_key,
                    platform,
                    trailer_type,
                    published_at
                )
                values (?, ?, ?, ?, ?, ?, ?, ?)
                on duplicate key update
                    movie_id = values(movie_id),
                    title = values(title),
                    video_url = values(video_url),
                    video_key = values(video_key),
                    platform = values(platform),
                    trailer_type = values(trailer_type),
                    published_at = values(published_at)
                `,
                [
                    normalizeValue(trailer.trailer_id),
                    normalizeValue(trailer.movie_id),
                    normalizeValue(trailer.title),
                    normalizeValue(trailer.video_url),
                    normalizeValue(trailer.video_key),
                    normalizeValue(trailer.platform),
                    normalizeValue(trailer.trailer_type),
                    normalizeValue(trailer.published_at)
                ]
            );
        }

        /*
         * =========================================
         * 9.5 ACTORS
         * =========================================
         */

        console.log("Syncing actors...");

        for (const actor of actors) {
            let profileUrl = normalizeValue(actor.profile_url);
            profileUrl = resolveBraveUrl(profileUrl);

            await connection.execute(
                `
                insert into actors (
                    actor_id,
                    actor_name,
                    profile_url
                )
                values (?, ?, ?)
                on duplicate key update
                    actor_name = values(actor_name),
                    profile_url = values(profile_url)
                `,
                [
                    normalizeValue(actor.actor_id),
                    normalizeValue(actor.actor_name),
                    profileUrl
                ]
            );
        }

        console.log("Syncing movie cast...");

        for (const cast of movieCast) {
            await connection.execute(
                `
                insert into movie_cast (
                    movie_id,
                    actor_id,
                    character_name,
                    cast_order
                )
                values (?, ?, ?, ?)
                on duplicate key update
                    character_name = values(character_name),
                    cast_order = values(cast_order)
                `,
                [
                    normalizeValue(cast.movie_id),
                    normalizeValue(cast.actor_id),
                    normalizeValue(cast.character_name),
                    normalizeValue(cast.cast_order)
                ]
            );
        }

        /*
         * =========================================
         * 10. COMMIT
         * =========================================
         */

        await connection.execute("SET FOREIGN_KEY_CHECKS=1;");
        await connection.commit();

        console.log("\n=================================");
        console.log("Synchronization completed!");
        console.log("=================================");
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("\nSynchronization failed.");
        console.error(error);

        process.exitCode = 1;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

syncMovies();