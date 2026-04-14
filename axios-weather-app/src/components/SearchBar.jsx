import React, { useState } from "react";

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!city.trim()) return;

    onSearch(city.trim());
    setCity("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔎</span>

      <input
        type="text"
        className="search-input"
        placeholder="Search or add a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? "Adding..." : "Add City"}
      </button>
    </form>
  );
}

export default SearchBar;