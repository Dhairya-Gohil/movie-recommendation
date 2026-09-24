import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar({ value, onChange, onSearch }) {

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (

        <div className="search-bar">

            <div className="search-input-wrapper">

                <Search
                    className="search-input-icon"
                    size={20}
                />

                <input
                    type="text"
                    placeholder="Search movies by title..."
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    aria-label="Search movies"
                    spellCheck="false"
                />

                {value && (
                    <span className="search-input-hint">
                        Press Enter
                    </span>
                )}

            </div>

            <button
                type="button"
                onClick={onSearch}
                className="search-button"
            >
                <Search size={18} />
                <span>Search</span>
            </button>

        </div>

    );

}

export default SearchBar;