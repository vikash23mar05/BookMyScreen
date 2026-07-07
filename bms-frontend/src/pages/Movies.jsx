import React, { useState } from "react";
import BannerSlider from "../components/shared/BannerSlider";
import MovieFilters from "../components/movies/MovieFilters";
import MovieList from "../components/movies/MovieList";
import { getAllMovies } from "../apis/index";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loader from "../components/shared/Loader";

const Movies = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const { data: allMovies, isLoading, isError } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => {
      return await getAllMovies();
    },
    placeholderData: keepPreviousData,
    select: (res) => res.data.movies,
  });

  // Perform client-side real-time filtering
  const filteredMovies = (allMovies ?? []).filter((movie) => {
    // 1. Search Query filter
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // 2. Language filter
    const matchesLanguage =
      selectedLanguage === "All" ||
      (movie.languages && movie.languages.includes(selectedLanguage));

    // 3. Genre filter
    const matchesGenre =
      selectedGenre === "All" ||
      (movie.genre && movie.genre.includes(selectedGenre));

    // 4. Format filter
    const matchesFormat =
      selectedFormat === "All" ||
      (movie.format && movie.format.includes(selectedFormat));

    return matchesSearch && matchesLanguage && matchesGenre && matchesFormat;
  });

  // Sort movies dynamically
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "votes") {
      return b.votes - a.votes;
    }
    return 0;
  });

  const handleClearFilters = () => {
    setSelectedLanguage("All");
    setSelectedGenre("All");
    setSelectedFormat("All");
    setSearchQuery("");
    setSortBy("latest");
  };

  return (
    <div className="bg-background min-h-screen text-on-surface pt-[80px]">
      <BannerSlider />
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        <MovieFilters
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          onClearAll={handleClearFilters}
        />
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader size="large" />
          </div>
        ) : isError ? (
          <div className="flex-1 text-center py-12 text-on-surface-variant">
            Failed to load movies. Please check your connection.
          </div>
        ) : (
          <MovieList
            allMovies={sortedMovies}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClearAll={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
};

export default Movies;
