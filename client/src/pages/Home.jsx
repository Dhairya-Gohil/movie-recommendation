import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard/MovieCard";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import "./Home.css";

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState({
        genre: "",
        language: "",
        year: "",
        rating: "",
        sortBy: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/movies"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data = await response.json();

                setMovies(data.movies || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load movies.");
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    useEffect(() => {
        const trimmedSearchTerm = searchTerm.trim();

        const hasFilters =
            trimmedSearchTerm ||
            filters.genre ||
            filters.language ||
            filters.year ||
            filters.rating ||
            filters.sortBy;

        if (!hasFilters) {
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();

                if (trimmedSearchTerm) {
                    params.append("q", trimmedSearchTerm);
                }

                if (filters.genre) {
                    params.append("genre", filters.genre);
                }

                if (filters.language) {
                    params.append("language", filters.language);
                }

                if (filters.year) {
                    params.append("year", filters.year);
                }

                if (filters.rating) {
                    params.append("rating", filters.rating);
                }

                if (filters.sortBy) {
                    params.append("sortBy", filters.sortBy);
                }

                const response = await fetch(
                    `http://localhost:5000/api/movies/filter?${params.toString()}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch filtered movies");
                }

                const data = await response.json();

                setMovies(data.movies || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load movies.");
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm, filters]);

    function handleFilterChange(event) {
        const { name, value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value
        }));
    }

    const isFilteredView =
        searchTerm.trim() ||
        filters.genre ||
        filters.language ||
        filters.year ||
        filters.rating ||
        filters.sortBy;

    const trendingMovies = useMemo(() => {
        return [...movies]
            .map((movie) => {
                const rating = Number(movie.imdb_rating) || 0;
                const votes = Number(movie.imdb_votes) || 0;

                const releaseDate = movie.release_date
                    ? new Date(movie.release_date)
                    : null;

                const now = new Date();

                let recencyScore = 0;

                if (
                    releaseDate &&
                    !Number.isNaN(releaseDate.getTime())
                ) {
                    const ageInDays =
                        Math.max(
                            0,
                            (now - releaseDate) /
                            (1000 * 60 * 60 * 24)
                        );

                    recencyScore =
                        Math.max(
                            0,
                            10 - ageInDays / 365
                        );
                }

                const ratingScore = rating * 2;

                const popularityScore =
                    Math.log10(votes + 1) * 2;

                return {
                    ...movie,
                    trendingScore:
                        ratingScore +
                        popularityScore +
                        recencyScore
                };
            })
            .sort(
                (a, b) =>
                    b.trendingScore -
                    a.trendingScore
            )
            .slice(0, 10);
    }, [movies]);

    const topRatedMovies = useMemo(() => {
        return [...movies]
            .sort((a, b) => {
                const ratingDifference =
                    (Number(b.imdb_rating) || 0) -
                    (Number(a.imdb_rating) || 0);

                if (ratingDifference !== 0) {
                    return ratingDifference;
                }

                return (
                    (Number(b.imdb_votes) || 0) -
                    (Number(a.imdb_votes) || 0)
                );
            })
            .slice(0, 10);
    }, [movies]);



    function renderMovieRow(title, movieList) {
        if (!movieList.length) {
            return null;
        }

        return (
            <section className="home-section movie-row-section">
                <div className="section-heading">
                    <h2 className="section-title">
                        {title}
                    </h2>
                </div>

                <div className="movie-row">
                    {movieList.map((movie) => (
                        <MovieCard
                            key={movie.movie_id}
                            movie={movie}
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <MainLayout>

            <div className="home-section search-section">
                <SearchBar
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    onSearch={() => { }}
                />
            </div>

            <div className="home-section filter-section">
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {loading && (
                <div className="home-status">
                    <p>Loading movies...</p>
                </div>
            )}

            {error && !loading && (
                <div className="home-status home-error">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && isFilteredView && (
                <section className="home-section filtered-results-section">

                    <h2 className="section-title">
                        {searchTerm.trim()
                            ? `Search Results for "${searchTerm}"`
                            : "Filtered Movies"}
                    </h2>

                    {movies.length === 0 ? (
                        <div className="home-status">
                            <p>No movies found.</p>
                        </div>
                    ) : (
                        <div className="movie-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.movie_id}
                                    movie={movie}
                                />
                            ))}
                        </div>
                    )}

                </section>
            )}

            {!loading && !error && !isFilteredView && (
                <>
                    {renderMovieRow(
                        "🔥 Trending Now",
                        trendingMovies
                    )}

                    {renderMovieRow(
                        "⭐ Top Rated",
                        topRatedMovies
                    )}

                    <section className="home-section all-movies-section">

                        <h2 className="section-title">
                            🎬 All Movies & Series
                        </h2>

                        <div className="movie-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.movie_id}
                                    movie={movie}
                                />
                            ))}
                        </div>

                    </section>
                </>
            )}

        </MainLayout>
    );
}

export default Home;