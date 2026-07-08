import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useLocation } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { location, setLocation, loading } = useLocation();
  const { toggleModal, auth, user } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-md border-b border-outline-variant/30">
        {/* Left Side: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-10">
          <div 
            onClick={() => navigate("/")} 
            className="text-2xl font-black text-white tracking-tighter cursor-pointer select-none hover:text-primary-container transition-colors"
          >
            Book<span className="text-primary-container">My</span>Screen
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/movies" className="text-on-surface-variant font-semibold hover:text-white transition-colors">Movies</Link>
            <span className="text-on-surface-variant font-semibold hover:text-white cursor-pointer transition-colors">Offers</span>
          </div>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center gap-6">
          {/* Search Input */}
          <div className="hidden lg:flex items-center bg-surface-container-high/40 rounded-full px-4 py-2 border border-outline-variant/50 focus-within:border-primary-container transition-all">
            <FaSearch className="text-on-surface-variant mr-2" />
            <input 
              type="text" 
              placeholder="Search Movies..." 
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-44 text-on-surface placeholder:text-on-surface-variant/70"
            />
          </div>

          {/* Location Selector */}
          <div 
            onClick={() => setIsLocationOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant cursor-pointer hover:text-white transition-colors bg-surface-container-low/40 border border-outline-variant/30 rounded-full px-4 py-1.5 hover:border-primary-container/50 hover:bg-surface-container-high/30"
          >
            {loading ? (
              <span className="text-xs">Locating...</span>
            ) : (
              <span className="flex items-center gap-1 font-bold">
                📍 {location || "Select City"}
              </span>
            )}
          </div>

          {/* User / Authentication */}
          {auth ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => navigate(`/profile/${user?._id}/profile`)}
                className="w-9 h-9 rounded-full bg-surface-variant/80 border border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary-container transition-all overflow-hidden"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-on-surface-variant text-sm" />
                )}
              </div>
              <span 
                onClick={() => navigate(`/profile/${user?._id}/profile`)}
                className="hidden sm:inline text-sm font-medium cursor-pointer text-on-surface-variant hover:text-white transition-colors"
              >
                Hi, {user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : "Guest")}
              </span>
            </div>
          ) : (
            <button 
              onClick={() => toggleModal()}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-bold primary-glow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Location Selector Modal */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
          <div className="w-[95%] sm:w-[90%] max-w-xl bg-[#0f1115] border border-outline-variant/40 rounded-[28px] shadow-2xl p-6 md:p-8 relative flex flex-col gap-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Select Location</h3>
                <p className="text-xs text-on-surface-variant/70 mt-0.5">Choose your state/region to find nearby theaters</p>
              </div>
              <button 
                onClick={() => setIsLocationOpen(false)}
                className="text-on-surface-variant/80 hover:text-white transition-colors cursor-pointer text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Grid of Locations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[320px] pr-1">
              {[
                { name: "Maharashtra", label: "Mumbai / Pune", icon: "🏛️" },
                { name: "West Bengal", label: "Kolkata", icon: "🌉" },
                { name: "Delhi", label: "Delhi NCR", icon: "🕌" },
                { name: "Karnataka", label: "Bangalore", icon: "💻" },
                { name: "Telangana", label: "Hyderabad", icon: "🕌" },
                { name: "Tamil Nadu", label: "Chennai", icon: "🛕" },
                { name: "Gujarat", label: "Ahmedabad", icon: "🦁" },
                { name: "Rajasthan", label: "Jaipur", icon: "👑" },
                { name: "Uttar Pradesh", label: "Lucknow", icon: "🏯" },
                { name: "Madhya Pradesh", label: "Indore / Bhopal", icon: "🏛️" },
                { name: "Bihar", label: "Patna", icon: "🛕" },
                { name: "Jharkhand", label: "Ranchi", icon: "🌲" }
              ].map((loc) => {
                const isActive = location === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setLocation(loc.name);
                      setIsLocationOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer group ${
                      isActive
                        ? "bg-primary-container text-on-primary-container border-primary-container shadow-lg shadow-primary-container/20 font-black scale-105"
                        : "bg-surface-container-high/30 border-outline-variant/30 text-on-surface-variant hover:border-primary-container/60 hover:text-white hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{loc.icon}</span>
                    <span className="text-xs font-black tracking-tight">{loc.name}</span>
                    <span className="text-[9px] opacity-60 font-semibold mt-0.5">{loc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

