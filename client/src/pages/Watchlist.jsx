import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard/MovieCard";
import { Bookmark } from "lucide-react";
import "./Watchlist.css";

function Watchlist() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchWatchlist() {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your watchlist.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/user-movies/watchlist",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch watchlist."
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

        fetchWatchlist();
    }, []);

    return (
        <MainLayout>

            <div className="watchlist-page">

                <div className="watchlist-header">

                    <div className="watchlist-heading">

                        <div className="watchlist-heading-icon">
                            <Bookmark
                                size={24}
                                strokeWidth={2.5}
                            />
                        </div>

                        <div>
                            <h1 className="watchlist-title">
                                My Watchlist
                            </h1>

                            <p className="watchlist-subtitle">
                                Movies you've saved to watch later
                            </p>
                        </div>

                    </div>

                    {!loading && !error && movies.length > 0 && (
                        <span className="watchlist-count">
                            {movies.length}{" "}
                            {movies.length === 1
                                ? "movie"
                                : "movies"}
                        </span>
                    )}

                </div>

                {loading && (
                    <div className="watchlist-status">
                        <p>Loading watchlist...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="watchlist-status watchlist-error">
                        <Bookmark size={24} />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && movies.length === 0 && (
                    <div className="watchlist-status watchlist-empty">

                        <div className="watchlist-empty-icon">
                            <Bookmark size={30} />
                        </div>

                        <h2>
                            Your Watchlist Is Empty
                        </h2>

                        <p>
                            You haven't added any movies to your
                            watchlist yet.
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

export default Watchlist;