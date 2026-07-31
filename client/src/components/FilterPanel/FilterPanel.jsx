import "./FilterPanel.css";

function FilterPanel() {

    return (

        <div className="filter-panel">

            <select>
                <option>Genre</option>
            </select>

            <select>
                <option>Language</option>
            </select>

            <select>
                <option>Year</option>
            </select>

            <select>
                <option>Rating</option>
            </select>

            <select>
                <option>Sort By</option>
            </select>

        </div>

    );

}

export default FilterPanel;