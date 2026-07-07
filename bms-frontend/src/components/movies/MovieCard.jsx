import React from "react";
import { useLocation } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { location } = useLocation();

  const handleNavigate = (movie) => {
    const originalTitle = movie.title;
    const cleanedTitle = originalTitle.includes(":")
      ? originalTitle.replace(/:/g, "")
      : originalTitle;
    const formattedTitle = cleanedTitle.replace(/\s+/g, "-").toLowerCase();
    const activeLocation = location || "west-bengal";
    navigate(`/movies/${activeLocation}/${formattedTitle}/${movie._id}/ticket`);
  };

  return (
    <div
      onClick={() => handleNavigate(movie)}
      className="group relative flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 primary-glow cursor-pointer shadow-lg border border-outline-variant/20 h-full"
    >
      {/* Poster Image Container */}
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        {/* Float Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-white border border-outline-variant/30">
          ★ {movie.rating}
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2">
        <div>
          <h4 className="font-bold text-white text-sm md:text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h4>
          <p className="text-[10px] md:text-xs text-on-surface-variant/80 font-medium line-clamp-1 mt-1">
            {movie.genre.join(" | ")}
          </p>
        </div>
        <div className="border-t border-outline-variant/20 pt-2 flex items-center justify-between">
          <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase">
            {movie.certification}
          </span>
          <span className="text-[10px] text-primary-container font-black truncate max-w-[70%]">
            {movie.languages.join(" | ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;