import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {

    return (

        <Link
            to={`/movies/${movie.movie_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >

            <div className="movie-card">

                <img
                    src={movie.poster_url}
                    alt={movie.title}
                />

                <div className="movie-content">

                    <h3 className="movie-title">{movie.title}</h3>

                    <p className="movie-rating">⭐ {movie.imdb_rating}</p>

                </div>

            </div>

        </Link>

    );

}

export default MovieCard;