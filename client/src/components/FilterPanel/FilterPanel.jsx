import { useEffect, useState } from "react";
import {
    SlidersHorizontal,
    Film,
    Languages,
    CalendarDays,
    Star,
    ArrowUpDown
} from "lucide-react";

import "./FilterPanel.css";

function FilterPanel({ filters, onFilterChange }) {

    const [options, setOptions] = useState({
        genres: [],
        languages: [],
        years: [],
        ratings: [],
        sortOptions: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchFilterOptions() {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/movies/options"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch filter options"
                    );
                }

                const data = await response.json();

                setOptions(data.options);

            } catch (error) {

                console.error(
                    "Error loading filter options:",
                    error
                );

            } finally {

                setLoading(false);

            }
        }

        fetchFilterOptions();

    }, []);

    if (loading) {

        return (
            <div className="filter-panel filter-panel-loading">

                <SlidersHorizontal size={18} />

                <p>
                    Loading filters...
                </p>

            </div>
        );

    }

    return (

        <div className="filter-panel">

            <div className="filter-panel-header">

                <div className="filter-panel-title">

                    <div className="filter-panel-title-icon">
                        <SlidersHorizontal size={17} />
                    </div>

                    <div>
                        <h3>
                            Filters
                        </h3>

                        <span>
                            Refine your movie search
                        </span>
                    </div>

                </div>

            </div>


            <div className="filter-controls">

                {/* GENRE */}

                <div className="filter-control">

                    <div className="filter-label">
                        <Film size={14} />
                        <span>Genre</span>
                    </div>

                    <select
                        name="genre"
                        value={filters.genre}
                        onChange={onFilterChange}
                        aria-label="Filter by genre"
                    >
                        <option value="">
                            All Genres
                        </option>

                        {options.genres.map((genre) => (
                            <option
                                key={genre.genre_id}
                                value={genre.genre_name}
                            >
                                {genre.genre_name}
                            </option>
                        ))}

                    </select>

                </div>


                {/* LANGUAGE */}

                <div className="filter-control">

                    <div className="filter-label">
                        <Languages size={14} />
                        <span>Language</span>
                    </div>

                    <select
                        name="language"
                        value={filters.language}
                        onChange={onFilterChange}
                        aria-label="Filter by language"
                    >
                        <option value="">
                            All Languages
                        </option>

                        {options.languages.map((language) => (
                            <option
                                key={language.language_id}
                                value={language.language_name}
                            >
                                {language.language_name}
                            </option>
                        ))}

                    </select>

                </div>


                {/* YEAR */}

                <div className="filter-control">

                    <div className="filter-label">
                        <CalendarDays size={14} />
                        <span>Year</span>
                    </div>

                    <select
                        name="year"
                        value={filters.year}
                        onChange={onFilterChange}
                        aria-label="Filter by year"
                    >
                        <option value="">
                            All Years
                        </option>

                        {options.years.map((year) => (
                            <option
                                key={year}
                                value={year}
                            >
                                {year}
                            </option>
                        ))}

                    </select>

                </div>


                {/* RATING */}

                <div className="filter-control">

                    <div className="filter-label">
                        <Star size={14} />
                        <span>Rating</span>
                    </div>

                    <select
                        name="rating"
                        value={filters.rating}
                        onChange={onFilterChange}
                        aria-label="Filter by rating"
                    >
                        <option value="">
                            Any Rating
                        </option>

                        {options.ratings.map((rating) => (
                            <option
                                key={rating}
                                value={rating}
                            >
                                {rating}+
                            </option>
                        ))}

                    </select>

                </div>


                {/* SORT */}

                <div className="filter-control">

                    <div className="filter-label">
                        <ArrowUpDown size={14} />
                        <span>Sort By</span>
                    </div>

                    <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={onFilterChange}
                        aria-label="Sort movies"
                    >
                        <option value="">
                            Default
                        </option>

                        {options.sortOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}

                    </select>

                </div>

            </div>

        </div>

    );
}

export default FilterPanel;