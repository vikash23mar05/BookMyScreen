import TheaterTimings from "../components/movies/TheaterTimings";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovieById } from "../apis/index";
import { useParams } from "react-router-dom";
import { FaShareAlt, FaPlus, FaRegHeart, FaStar } from "react-icons/fa";

const mockCastData = {
  "avatar: fire and ash": [
    { name: "Sam Worthington", role: "Jake Sully", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhXOWKMd02tkAKIsHA2jElPjmYWHqlDcSm1rAmVidCTdlKmQ59KiGi7ZRuP_jT-thxGil-AfZhrftgt4TLrl4I68Vhhy0vBbVgt6GTWGvRlDKUHe6wLajVKbysY808Y_mRf7o25X1bn09_TlsaoDmh_5EI-4LijbBGCTs3J9RyTcoenQdvMIBfqgLv3Tf90r72CioRn_eHdYdewRXNhDYjFK4L4UORva5wZmU3ynRR33FrT4-kz4wgdg" },
    { name: "Zoe Saldana", role: "Neytiri", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdTmqF8HbkibIzC7JmafcgKwUp2feQE1DMqBNfPwbd0GH4ZrsA0UVuq2AdVyHdfe3h6edsaHWhgllKYOjSLbYUx64JNA2ZE0_LkIIbfx6Fyr9z2FIu5LHZztHOcKl2uft1IMgVnAw3UGw0d6ygWfSjvWldwKqa91brfMI34HPuho6SVKyWmaxwsJC5RDTz1hdhk7oz1g5LWJB1fFNXK-2s1DM3_M52rdOdwgM5C-1cGLpGcI8IHbrEBQ" },
    { name: "Sigourney Weaver", role: "Kiri", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Jthi369G9T1HFu5SQ59gzJVRqyw-7sIjKZxbvwDlo_8Rn2tky_Ea4AC-hxWO0A_oDVNoW4OB0KaTXoP3iTDXgW-VKT7ViMInnL0k4bWk5xje0Apz0UXtUWUvMiCsq_HKtehn3WY8ZDSBx3glLb1MoosMMJvyjHYbwlNYtsfROEc82Wo8ro3xg_A45wFOtABnniCzkebiZl9_sRwPmWTCRQlwKZ9MJBSkJXdEiqYhaaIKB3aoSJftow" }
  ],
  "superman": [
    { name: "David Corenswet", role: "Clark Kent / Superman", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhXOWKMd02tkAKIsHA2jElPjmYWHqlDcSm1rAmVidCTdlKmQ59KiGi7ZRuP_jT-thxGil-AfZhrftgt4TLrl4I68Vhhy0vBbVgt6GTWGvRlDKUHe6wLajVKbysY808Y_mRf7o25X1bn09_TlsaoDmh_5EI-4LijbBGCTs3J9RyTcoenQdvMIBfqgLv3Tf90r72CioRn_eHdYdewRXNhDYjFK4L4UORva5wZmU3ynRR33FrT4-kz4wgdg" },
    { name: "Rachel Brosnahan", role: "Lois Lane", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Vbompr97KX4f8UAdRVez6xfR63P5KyaPIMKzldnXQOe3OkdSuWW7KSvLZ2KLrRk_gpD6hbnQ23x4IK1fhlcE87NBrAMtg8upGWOFqMn36kSpfk5RVOUrfoiLtP7PtBGJQ4NeahSWH55C6uSapFhJ-Jb3DLLXpLInE1kI8B2Z0_Iyd2Ylb55jN4vS_QFdkzSqSCcvAJmp7HID6x2Pz09y7FYBcxhGMMt3i4Lxw8lGo0_RZnI_jwbsWA" }
  ],
  "default": [
    { name: "Ryan Gosling", role: "Lead Actor", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhXOWKMd02tkAKIsHA2jElPjmYWHqlDcSm1rAmVidCTdlKmQ59KiGi7ZRuP_jT-thxGil-AfZhrftgt4TLrl4I68Vhhy0vBbVgt6GTWGvRlDKUHe6wLajVKbysY808Y_mRf7o25X1bn09_TlsaoDmh_5EI-4LijbBGCTs3J9RyTcoenQdvMIBfqgLv3Tf90r72CioRn_eHdYdewRXNhDYjFK4L4UORva5wZmU3ynRR33FrT4-kz4wgdg" },
    { name: "Emma Stone", role: "Lead Actress", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Vbompr97KX4f8UAdRVez6xfR63P5KyaPIMKzldnXQOe3OkdSuWW7KSvLZ2KLrRk_gpD6hbnQ23x4IK1fhlcE87NBrAMtg8upGWOFqMn36kSpfk5RVOUrfoiLtP7PtBGJQ4NeahSWH55C6uSapFhJ-Jb3DLLXpLInE1kI8B2Z0_Iyd2Ylb55jN4vS_QFdkzSqSCcvAJmp7HID6x2Pz09y7FYBcxhGMMt3i4Lxw8lGo0_RZnI_jwbsWA" }
  ]
};

const MovieDetails = () => {
  const { id } = useParams();

  const { data: movieResponse } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => await getMovieById(id),
    placeholderData: keepPreviousData,
  });

  const movie = movieResponse?.data?.movie || null;

  const movieKey = movie?.title?.toLowerCase() || "";
  const cast = mockCastData[movieKey] || mockCastData["default"];

  return (
    <div className="w-full bg-background text-on-surface min-h-screen">
      {/* 🎬 Widescreen Hero Section */}
      {movie && (
        <section className="relative h-[65vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
              {/* Floating Poster */}
              <div className="w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 flex-shrink-0 hidden md:block group">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary-container text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                    Featured
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaStar />
                    <span className="font-bold text-sm">{movie.rating}</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">
                    ({movie.votes} Votes)
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter leading-tight">
                  {movie.title}
                </h1>
                <p className="text-sm text-on-surface-variant font-medium mb-6">
                  {movie.duration} • {movie.genre.join(", ")} • {movie.certification} • {new Date(movie.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-bold primary-glow hover:scale-105 active:scale-95 transition-transform cursor-pointer text-sm">
                    Watch Trailer
                  </button>
                  <button className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 text-on-surface px-6 py-2.5 rounded-xl font-bold hover:bg-surface-container-high transition-colors text-sm cursor-pointer">
                    <FaPlus /> Watchlist
                  </button>
                  <button className="flex items-center gap-2 glass-card text-on-surface px-4 py-2.5 rounded-xl font-bold hover:bg-surface-variant/30 transition-colors text-sm cursor-pointer">
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🍱 Content Bento Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details, About & Cast */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Card */}
          {movie && (
            <div className="glass-card p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">About the Movie</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {movie.description}
              </p>
            </div>
          )}

          {/* Cast Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Cast & Crew</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {cast.map((c, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-outline-variant/50 group-hover:border-primary-container transition-colors shadow-md">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-xs text-on-surface-variant/80 mt-0.5">{c.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Showtime & Booking */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Book Tickets</h3>
            
            {/* Show Availability Legend */}
            <div className="flex items-center justify-between rounded-xl mb-6 p-3 bg-surface-container-low border border-outline-variant/30 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 bg-tertiary rounded-full"></span> Available
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span> Filling Fast
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 bg-primary-container rounded-full"></span> Almost Full
              </span>
            </div>

            <TheaterTimings movieId={id} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;

