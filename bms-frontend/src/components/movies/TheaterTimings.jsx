import { useState } from "react";
import dayjs from "dayjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowsByMovieAndLocation } from "../../apis";
import { useLocation } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../shared/Loader";

const TheaterTimings = ({ movieId }) => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { auth, toggleModal } = useAuth();

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const formattedDate = selectedDate.format("DD-MM-YYYY");

  const next7days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));

  const { data: showData, isLoading, isError } = useQuery({
    queryKey: ["show", movieId, location, formattedDate],
    queryFn: async () => await getShowsByMovieAndLocation(movieId, location, formattedDate),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return (
    <div className="w-full">
      {/* 📅 Date Selector */}
      <div className="flex items-center gap-2.5 mb-6 overflow-x-auto py-2 scrollbar-hide">
        {next7days.map((date, i) => {
          const isSelected = selectedDate.isSame(date, "day");
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl min-w-[60px] border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-primary-container border-primary-container text-on-primary-container shadow-lg scale-105"
                  : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-on-surface hover:text-white"
              }`}
            >
              <span className="text-base font-black leading-none">{date.format("D")}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{date.format("ddd")}</span>
            </button>
          );
        })}
      </div>

      {/* 🏛️ Theaters and Shows list */}
      <div className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 bg-surface-container-low/20 rounded-xl border border-outline-variant/30">
            <Loader size="medium" />
            <p className="text-on-surface-variant animate-pulse font-medium text-sm">Loading available shows...</p>
          </div>
        )}

        {!isLoading && showData?.length === 0 && (
          <div className="text-center py-8 text-on-surface-variant/60 text-sm glass-card rounded-xl">
            No shows available for the selected date.
          </div>
        )}

        {showData?.map((curr, i) => (
          <div 
            key={i} 
            className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 hover:border-outline-variant/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={curr.theater.theaterDetails.logo}
                alt="logo"
                className="w-8 h-8 object-contain rounded-full bg-white/10 p-0.5"
              />
              <div>
                <p className="font-bold text-sm text-white">{curr.theater.theaterDetails.name}</p>
                <p className="text-[10px] text-tertiary font-bold tracking-wide uppercase">Allows Cancellation</p>
              </div>
            </div>

            {/* 🕒 Show Timings slots */}
            <div className="flex flex-wrap gap-2.5">
              {curr.theater.shows.map((slot, idx) => {
                const theaterId = curr.theater.theaterDetails._id;
                const movieName = curr.movie.title;
                return (
                  <button
                    onClick={() => {
                      if (!auth) {
                        toggleModal();
                        return;
                      }
                      navigate(
                        `/movies/${movieId}/${movieName}/${location}/theater/${theaterId}/show/${slot._id}/seat-layout`
                      );
                    }}
                    key={idx}
                    className="flex flex-col items-center justify-center bg-surface-container-high/80 border border-outline-variant/30 hover:border-primary-container hover:bg-surface-container-highest rounded-xl px-5 py-2 text-xs transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-white group-hover:text-primary-container transition-colors">
                      {slot.startTime}
                    </span>
                    <span className="text-[9px] text-on-surface-variant font-bold tracking-widest mt-0.5 uppercase">
                      {slot.audioType}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterTimings;

