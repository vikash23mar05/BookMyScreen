import React from "react";
import MovieCard from "./MovieCard";
import { FaSearch, FaFilm } from "react-icons/fa";

const MovieList = ({ allMovies, searchQuery, setSearchQuery, sortBy, setSortBy, onClearAll }) => {
  return (
    <div className="flex-1 space-y-6">
      {/* Search Bar & Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between glass-card p-6 rounded-2xl border border-outline-variant/30">
        <h3 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <FaFilm className="text-primary-container" /> Movies
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* Sort Selector */}
          <div className="flex items-center bg-surface-container-high/40 rounded-xl px-3 py-2 border border-outline-variant/50 focus-within:border-primary-container transition-all w-full sm:w-auto">
            <span className="text-xs text-on-surface-variant/75 mr-2 font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white font-bold cursor-pointer focus:ring-0 pr-8"
            >
              <option value="latest" className="bg-[#0f1115] text-white">Latest Releases</option>
              <option value="rating" className="bg-[#0f1115] text-white">Highest Rated</option>
              <option value="votes" className="bg-[#0f1115] text-white">Most Popular</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex items-center bg-surface-container-high/40 rounded-xl px-4 py-2 border border-outline-variant/50 focus-within:border-primary-container transition-all w-full sm:w-64">
            <FaSearch className="text-on-surface-variant mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies by title..."
              className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full text-on-surface placeholder:text-on-surface-variant/70"
            />
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {allMovies.length === 0 ? (
        <div className="glass-card p-12 rounded-[28px] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
          <div className="text-4xl text-on-surface-variant/40">🎬</div>
          <h4 className="text-lg font-bold text-white">No Movies Found</h4>
          <p className="text-sm text-on-surface-variant/80 max-w-sm">
            We couldn't find any movies matching your current filters or search query.
          </p>
          <button
            onClick={onClearAll}
            className="mt-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all primary-glow cursor-pointer"
          >
            Reset Filters & Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;