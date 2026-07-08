import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

dayjs.extend(customParseFormat);

const Header = ({ showData, type }) => {
  const navigate = useNavigate();
  const { auth, user, toggleModal } = useAuth();
  
  return (
    <div className="w-full bg-background border-b border-outline-variant/30 z-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate("/")} 
          className="text-xl md:text-2xl font-black text-white tracking-tighter cursor-pointer select-none hover:text-primary-container transition-colors"
        >
          Book<span className="text-primary-container">My</span>Screen
        </div>

        {type === "checkout" ? (
          <div>
            <h2 className="font-extrabold text-white text-base md:text-lg tracking-tight">
              Review your booking
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-black text-white text-base md:text-lg tracking-tight">
              {showData?.movie.title}
            </h2>
            <p className="text-[10px] md:text-xs text-on-surface-variant/80 font-bold mt-0.5">
              {dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM YYYY")} &nbsp;•&nbsp; {showData?.startTime} at{" "}
              {showData?.theater.name +
                ", " +
                showData?.theater.city +
                ", " +
                showData?.theater.state}
            </p>
          </div>
        )}

        {auth ? (
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate(`/profile/${user?._id}/profile`)}
              className="w-8 h-8 rounded-full bg-surface-variant/80 border border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary-container transition-all overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-on-surface-variant text-xs" />
              )}
            </div>
            <span
              onClick={() => navigate(`/profile/${user?._id}/profile`)}
              className="hidden sm:inline text-xs font-semibold cursor-pointer text-on-surface-variant hover:text-white transition-colors"
            >
              Hi, {user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : "Guest")}
            </span>
          </div>
        ) : (
          <button
            onClick={() => toggleModal()}
            className="bg-primary-container text-on-primary-container px-5 py-1.5 rounded-full font-bold text-xs primary-glow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>

      {/* Show Timings */}
      {type !== "checkout" && (
        <div className="bg-surface-container-low/40 py-3 border-t border-outline-variant/20">
          <div className="mx-auto px-6 flex items-center gap-4 max-w-7xl">
            <div className="text-xs">
              <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-wider">
                {dayjs(showData?.date, "DD-MM-YYYY").format("ddd")}
              </p>
              <p className="font-extrabold text-white">
                {dayjs(showData?.date, "DD-MM-YYYY").format("DD MMMM")}
              </p>
            </div>

            <button className="bg-surface-container-high border border-outline-variant/30 rounded-xl px-6 py-1.5 text-xs font-bold text-white shadow-sm flex flex-col items-center">
              {showData?.startTime}
              <span className="text-[8px] text-on-surface-variant font-bold tracking-widest mt-0.5 uppercase">
                {showData?.audioType.toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

