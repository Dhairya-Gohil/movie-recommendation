import MainLayout from "../layouts/MainLayout";
import MovieCard from "../components/MovieCard/MovieCard";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import "./Home.css";

const movies = [

    {
        movie_id: 1,
        title: "Dhurandhar",
        rating: 8.7,
        poster_url: "https://via.placeholder.com/220x320"
    },

    {
        movie_id: 2,
        title: "Dhurandhar The Revenge",
        rating: 8.8,
        poster_url: "https://via.placeholder.com/220x320"
    },

    {
        movie_id: 3,
        title: "MS Dhoni The Untold Story",
        rating: 9.0,
        poster_url: "https://via.placeholder.com/220x320"
    }

];

function Home() {
    return (

        <MainLayout>
            <div className="home-section">

                <SearchBar
                    value=""
                    onChange={() => { }}
                    onSearch={() => { }}
                />

            </div>

            <div className="home-section">

                <FilterPanel />

            </div>

            <div className="home-section">

                <h2 className="section-title">

                    🔥 Trending Now

                </h2>

                <div className="movie-grid">

                    {movies.map(movie => (

                        <MovieCard
                            key={movie.movie_id}
                            movie={movie}
                        />

                    ))}

                </div>

            </div>
        </MainLayout>

    );

}

export default Home;