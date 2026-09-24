import { useEffect, useState } from "react";
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
                const response = await fetch("http://localhost:5000/api/movies");

                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data = await response.json();

                setMovies(data.movies);
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

                const queryString = params.toString();

                const url = queryString
                    ? `http://localhost:5000/api/movies/filter?${queryString}`
                    : "http://localhost:5000/api/movies";

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data = await response.json();

                setMovies(data.movies);
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

    return (
        <MainLayout>
            <div className="home-section">

                <SearchBar
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onSearch={() => { }}
                />

            </div>

            <div className="home-section">

                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

            </div>

            <div className="home-section">

                <h2 className="section-title">
                    {searchTerm.trim()
                        ? `Search Results for "${searchTerm}"`
                        : "🔥 Trending Now"}
                </h2>

                {loading && (
                    <p>Loading movies...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!loading && !error && movies.length === 0 && (
                    <p>No movies found.</p>
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

export default Home;