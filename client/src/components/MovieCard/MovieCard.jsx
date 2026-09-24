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
                    src={
                        movie.poster_url && movie.poster_url !== "NA"
                            ? movie.poster_url
                            : "https://via.placeholder.com/300x450?text=No+Poster"
                    }
                    alt={movie.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                />

                <div className="movie-content">

                    <h3 className="movie-title">
                        {movie.title}
                    </h3>

                    <p className="movie-rating">
                        ⭐ {movie.imdb_rating}
                    </p>

                </div>

            </div>

        </Link>

    );

}

export default MovieCard;