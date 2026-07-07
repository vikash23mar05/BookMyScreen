import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../apis";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { FaPlay, FaTicketAlt, FaPlus, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Fetch Recommended Movies
  const { data: recMovies, isLoading, isError } = useQuery({
    queryKey: ["recommendedMovies"],
    queryFn: async () => await getRecommendedMovies(),
    placeholderData: keepPreviousData,
  });

  const moviesList = recMovies?.data?.topMovies || [];

  // Get unique genres from movie list
  const genres = ["All", ...new Set(moviesList.flatMap((m) => m.genre))];

  // Filter movies
  const filteredMovies =
    selectedGenre === "All"
      ? moviesList
      : moviesList.filter((m) => m.genre.includes(selectedGenre));

  // Widescreen Hero Movie: Use the first movie or fallback
  const heroMovie = moviesList[0] || null;

  // Recommended Bento Movie: Use the second movie or fallback
  const recommendedBentoMovie = moviesList[1] || heroMovie;

  const handleNavigate = (movie) => {
    if (!movie) return;
    const originalTitle = movie.title;
    const cleanedTitle = originalTitle.includes(":")
      ? originalTitle.replace(/:/g, "")
      : originalTitle;
    const formattedTitle = cleanedTitle.replace(/\s+/g, "-").toLowerCase();
    const activeLocation = location || "west-bengal";
    navigate(`/movies/${activeLocation}/${formattedTitle}/${movie._id}/ticket`);
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface">
      {/* 🎬 Widescreen Hero Banner */}
      {heroMovie && (
        <section className="relative h-[75vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${heroMovie.posterUrl})` }}
          >
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary-container text-on-primary-container text-xs px-3 py-1 rounded-full font-bold tracking-wider">
                  NOW TRENDING
                </span>
                <span className="text-sm text-tertiary flex items-center gap-1">
                  ★ {heroMovie.rating} IMDb
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-md">
                {heroMovie.title}
              </h2>
              <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mb-8 line-clamp-3">
                {heroMovie.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleNavigate(heroMovie)}
                  className="flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all primary-glow cursor-pointer"
                >
                  <FaTicketAlt /> Book Tickets
                </button>
                <button className="flex items-center gap-2 neon-border text-on-surface px-8 py-3.5 rounded-xl font-bold hover:bg-secondary/15 transition-all cursor-pointer">
                  <FaPlay /> Watch Trailer
                </button>
                <button className="w-12 h-12 rounded-xl border border-outline-variant hover:bg-surface-variant/40 flex items-center justify-center transition-all cursor-pointer">
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🏷️ Genre Filter Tabs */}
      <section className="px-6 md:px-12 py-8 relative z-20 -mt-6">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedGenre === genre
                  ? "bg-primary-container text-on-primary-container shadow-md"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* 🍿 Now Showing Grid */}
      <section className="px-6 md:px-12 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Now Showing</h3>
            <p className="text-sm text-on-surface-variant">
              Explore the latest blockbusters in our premium theaters.
            </p>
          </div>
          <button
            onClick={() => navigate("/movies")}
            className="text-primary-container font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            View All <FaChevronRight className="text-xs" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-surface-container-high/40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => handleNavigate(movie)}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass-card transition-all duration-500 hover:-translate-y-2 primary-glow cursor-pointer shadow-lg"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 poster-gradient flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="text-lg font-bold text-white mb-1 leading-tight line-clamp-2">
                    {movie.title}
                  </h4>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-tertiary font-bold">★ {movie.rating}</span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {movie.genre[0]}
                    </span>
                  </div>
                  <button className="w-full bg-primary-container text-on-primary-container py-2.5 rounded-xl font-bold text-sm shadow-md">
                    Book Now
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 border border-outline-variant/30">
                  ⭐ {movie.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🍱 Bento Grid Section: Recommended For You & Coming Soon */}
      <section className="px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended (Bento Large Card) */}
          {recommendedBentoMovie && (
            <div className="lg:col-span-2 glass-card rounded-[28px] p-6 md:p-8 overflow-hidden relative flex flex-col justify-between min-h-[400px]">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Recommended for You</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  Based on your premium viewing preferences.
                </p>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-outline-variant/30 flex-shrink-0">
                    <img
                      src={recommendedBentoMovie.posterUrl}
                      alt={recommendedBentoMovie.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {recommendedBentoMovie.title}
                    </h4>
                    <div className="flex gap-2 mb-4">
                      {recommendedBentoMovie.format?.map((f) => (
                        <span key={f} className="text-xs bg-surface-container-high px-3 py-1 rounded-full text-on-surface font-semibold border border-outline-variant/30">
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                      {recommendedBentoMovie.description}
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleNavigate(recommendedBentoMovie)}
                        className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all primary-glow cursor-pointer"
                      >
                        Book Seat
                      </button>
                      <button className="neon-border text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
            </div>
          )}

          {/* Coming Soon List Card */}
          <div className="glass-card rounded-[28px] p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Upcoming Blockbusters</h3>
            <div className="flex flex-col gap-5 flex-grow">
              {moviesList.slice(2, 6).map((movie) => (
                <div 
                  key={movie._id} 
                  onClick={() => handleNavigate(movie)}
                  className="flex gap-4 group cursor-pointer border-b border-outline-variant/20 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/30">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm line-clamp-1">
                      {movie.title}
                    </p>
                    <p className="text-xs text-primary-container font-semibold mt-1">
                      {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;