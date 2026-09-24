import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard/MovieCard";
import { Heart } from "lucide-react";
import "./Favourites.css";

function Favorites() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchFavorites() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your favorites.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/user-movies/favorites",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch favorites."
                    );
                }

                setMovies(data.movies);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, []);

    return (
        <MainLayout>

            <div className="favorites-page">

                <div className="favorites-header">

                    <div className="favorites-heading">

                        <div className="favorites-heading-icon">
                            <Heart
                                size={24}
                                strokeWidth={2.5}
                            />
                        </div>

                        <div>
                            <h1 className="favorites-title">
                                My Favorites
                            </h1>

                            <p className="favorites-subtitle">
                                Movies you've saved as favorites
                            </p>
                        </div>

                    </div>

                    {!loading && !error && movies.length > 0 && (
                        <span className="favorites-count">
                            {movies.length}{" "}
                            {movies.length === 1
                                ? "movie"
                                : "movies"}
                        </span>
                    )}

                </div>

                {loading && (
                    <div className="favorites-status">
                        <p>Loading favorites...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="favorites-status favorites-error">
                        <Heart size={24} />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && movies.length === 0 && (
                    <div className="favorites-status favorites-empty">

                        <div className="favorites-empty-icon">
                            <Heart size={30} />
                        </div>

                        <h2>
                            No Favorites Yet
                        </h2>

                        <p>
                            You haven't added any movies to your
                            favorites yet.
                        </p>

                    </div>
                )}

                {!loading && !error && movies.length > 0 && (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.movie_id}
                                movie={movie}
                            />
                        ))}
                    </div>
                )}

            </div>

        </MainLayout>
    );
}

export default Favorites;