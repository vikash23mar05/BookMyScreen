import React from "react";
import { languages } from "../../utils/constants";

const genres = [
  "Action",
  "Thriller",
  "Fantasy",
  "Horror",
  "Mythological",
  "Sports",
  "Documentary",
  "Romance",
  "Drama",
  "Animation",
  "Adventure",
  "Sci-Fi",
  "Family"
];

const formats = ["2D", "3D", "IMAX", "PVR PXL", "IMAX 3D"];

const MovieFilters = ({
  selectedLanguage,
  setSelectedLanguage,
  selectedGenre,
  setSelectedGenre,
  selectedFormat,
  setSelectedFormat,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedLanguage !== "All" ||
    selectedGenre !== "All" ||
    selectedFormat !== "All";

  const handleToggleLanguage = (lang) => {
    setSelectedLanguage(selectedLanguage === lang ? "All" : lang);
  };

  const handleToggleGenre = (genre) => {
    setSelectedGenre(selectedGenre === genre ? "All" : genre);
  };

  const handleToggleFormat = (fmt) => {
    setSelectedFormat(selectedFormat === fmt ? "All" : fmt);
  };

  return (
    <div className="w-full md:w-72 flex-shrink-0 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white tracking-wide uppercase">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-primary-container hover:underline cursor-pointer transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Languages */}
      <div className="glass-card p-5 rounded-2xl border border-outline-variant/30">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-white tracking-wide uppercase">Languages</span>
          {selectedLanguage !== "All" && (
            <button
              onClick={() => setSelectedLanguage("All")}
              className="text-[10px] text-primary-container font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => handleToggleLanguage(lang)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-container text-on-primary-container border-primary-container"
                    : "border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:text-white"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genres */}
      <div className="glass-card p-5 rounded-2xl border border-outline-variant/30">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-white tracking-wide uppercase">Genres</span>
          {selectedGenre !== "All" && (
            <button
              onClick={() => setSelectedGenre("All")}
              className="text-[10px] text-primary-container font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => handleToggleGenre(genre)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-container text-on-primary-container border-primary-container"
                    : "border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:text-white"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div className="glass-card p-5 rounded-2xl border border-outline-variant/30">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-white tracking-wide uppercase">Format</span>
          {selectedFormat !== "All" && (
            <button
              onClick={() => setSelectedFormat("All")}
              className="text-[10px] text-primary-container font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {formats.map((fmt) => {
            const isSelected = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                onClick={() => handleToggleFormat(fmt)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-container text-on-primary-container border-primary-container"
                    : "border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:text-white"
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;
