import React from "react";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";

const BannerSlider = () => {
  const navigate = useNavigate();
  const { location } = useLocation();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["bannerMovies"],
    queryFn: async () => {
      const res = await getAllMovies();
      return res?.data?.movies || [];
    },
  });

  // Sort by releaseDate descending to get the latest movies
  const latestMovies = [...movies]
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 5);

  const handleNavigate = (movie) => {
    const originalTitle = movie.title;
    const cleanedTitle = originalTitle.includes(":")
      ? originalTitle.replace(/:/g, "")
      : originalTitle;
    const formattedTitle = cleanedTitle.replace(/\s+/g, "-").toLowerCase();
    const activeLocation = location || "west-bengal";
    navigate(`/movies/${activeLocation}/${formattedTitle}/${movie._id}/ticket`);
  };

  const settings = {
    centerMode: true,
    centerPadding: "240px", // Side preview space
    slidesToShow: 1,
    infinite: latestMovies.length > 1,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 800,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          centerPadding: "160px",
        }
      },
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "80px",
        }
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          centerPadding: "0px",
        }
      }
    ]
  };

  if (isLoading || latestMovies.length === 0) {
    return (
      <div className="w-full bg-background/20 py-8 border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full h-[180px] sm:h-[260px] md:h-[320px] rounded-2xl bg-surface-container-high/40 animate-pulse border border-outline-variant/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background/20 py-8 border-b border-outline-variant/15">
      <div className="mx-auto px-4">
        <Slider {...settings} >
          {latestMovies.map((movie) => (
            <div 
              key={movie._id} 
              onClick={() => handleNavigate(movie)}
              className="px-2 outline-none cursor-pointer group relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 shadow-xl transition-all duration-500 group-hover:scale-[1.01] group-hover:border-primary-container">
                <img
                  src={movie.backdropUrl || movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-[180px] sm:h-[260px] md:h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Visual Glass Overlay with Title & Genre */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-1.5 drop-shadow-md">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-primary-container font-bold tracking-widest uppercase">
                    {movie.genre?.join(" | ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;
