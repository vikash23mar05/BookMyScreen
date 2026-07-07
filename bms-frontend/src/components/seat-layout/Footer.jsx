import React from "react";
import { useNavigate } from "react-router-dom";
import { useSeatContext } from "../../context/SeatContext";
import { socket } from "../../utils/socket";
import { useAuth } from "../../context/AuthContext";

const Footer = ({ isSelected, selectedSeats, showData, state }) => {
  const navigate = useNavigate();
  const { setShows } = useSeatContext();
  const { user } = useAuth();

  const handleNavigateToCheckout = () => {
    socket.emit("lock-seats", {
      showId: showData._id,
      seatIds: selectedSeats,
      userId: user._id,
    });
    navigate(`/shows/${showData._id}/${state}/checkout`);
    setShows(showData);
  };

  return (
    <div className="w-full bg-background/95 border-t border-outline-variant/30 py-4 px-6 z-20">
      {isSelected ? (
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-white font-bold text-sm md:text-base">
            {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""} Selected
          </p>
          <button
            onClick={handleNavigateToCheckout}
            className="bg-primary-container text-on-primary-container px-8 py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95 primary-glow cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-on-surface-variant/80 font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border border-outline-variant/80 rounded-md"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-surface-container-high border border-outline-variant/20 rounded-md flex items-center justify-center text-[9px] text-on-surface-variant/50">
                X
              </div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-primary-container border border-primary-fixed rounded-md shadow-sm"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border border-yellow-500/80 rounded-md vip-shimmer bg-yellow-500/10"></div>
              <span>VIP / Premium</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;

