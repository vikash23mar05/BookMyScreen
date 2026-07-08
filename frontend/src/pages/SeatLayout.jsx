import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis/index";
import { useSeatContext } from "../context/SeatContext";
import { useLocation } from "../context/LocationContext";
import { socket } from "../utils/socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/shared/Loader";

const Seat = ({ seat, row, selectedSeats, lockedSeats, isPremium, onClick }) => {
  const seatId = `${row}${seat.number}`;
  const isLocked = lockedSeats?.includes(seatId);
  const isSelected = selectedSeats.includes(seatId);
  const isBooked = seat.status === "BOOKED";

  return (
    <button
      className={`w-9 h-9 m-[3px] rounded-lg border text-xs font-bold transition-all duration-300 select-none
        ${
          isBooked
            ? "bg-surface-container-high/40 border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed line-through"
            : isLocked
            ? "bg-surface-container-high/30 border-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed"
            : isSelected
            ? "bg-primary-container text-on-primary-container border-primary-fixed shadow-lg shadow-primary-container/30 scale-105 cursor-pointer"
            : isPremium
            ? "border border-yellow-500/80 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/25 cursor-pointer vip-shimmer"
            : "border border-outline-variant/60 hover:border-primary-container hover:bg-surface-variant/50 hover:scale-110 text-on-surface-variant hover:text-white cursor-pointer"
        }`}
      disabled={isBooked || isLocked}
      onClick={onClick}
    >
      {isBooked || isLocked ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {
  const [lockedSeats, setLockedSeats] = useState([]);
  const { selectedSeats, setSelectedSeats } = useSeatContext();
  const { location } = useLocation();
  const { showId } = useParams();

  const handleSelectSeat = (row, number) => {
    const seatId = `${row}${number}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((existingId) => existingId !== seatId)
        : [...prev, seatId]
    );
  };

  const { data: showData, isLoading, isError } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    placeholderData: keepPreviousData,
    enabled: !!showId,
    select: (res) => res.data,
  });

  const isSelectedSeats = selectedSeats.length > 0;

  useEffect(() => {
    setSelectedSeats([]);
    socket.emit("join-show", { showId });

    socket.on("locked-seats-initials", ({ seatIds }) => {
      setLockedSeats(seatIds);
    });

    socket.on("seat-locked", ({ seatIds, showId: incomingShowId }) => {
      if (incomingShowId !== showId) return;
      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    });

    socket.on("seat-unlocked", ({ seatIds, showId: incomingShowId }) => {
      if (incomingShowId !== showId) return;
      setLockedSeats((prev) => prev.filter((id) => !seatIds.includes(id)));
    });

    socket.on("seat-locked-failed", ({ showId: incomingShowId, alreadyLocked }) => {
      if (incomingShowId !== showId) return;
      toast.error(`Some seats are already locked: ${alreadyLocked.join(", ")}`);
    });

    return () => {
      socket.off("locked-seats-initials");
      socket.off("seat-locked");
      socket.off("seat-unlocked");
      socket.off("seat-locked-failed");
    };
  }, [showId]);

  return (
    <div className="h-screen overflow-y-hidden bg-background text-on-surface">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Header showData={showData} />
      </div>

      {/* Scrollable Seat Layout Container */}
      <div className="max-w-7xl mx-auto mt-[150px] px-6 pb-32 h-[calc(100vh-210px)] overflow-y-auto scrollbar-hide flex flex-col items-center">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-6">
            <Loader size="medium" />
            <p className="text-on-surface-variant animate-pulse font-medium">Loading theater seating plan...</p>
          </div>
        )}

        {!isLoading && showData?.seatLayout && (
          <div className="flex flex-col items-center w-full">
            {/* Seating categories */}
            {Object.entries(
              showData.seatLayout.reduce((acc, curr) => {
                if (!acc[curr.type]) acc[curr.type] = { price: curr.price, rows: [] };
                acc[curr.type].rows.push(curr);
                return acc;
              }, {})
            ).map(([type, { price, rows }]) => (
              <div key={type} className="mb-10 w-full flex flex-col items-center justify-center">
                <h3 className="text-center text-xs font-bold text-on-surface-variant/80 tracking-widest uppercase mb-4">
                  {type} — ₹{price}
                </h3>
                <div className="space-y-3">
                  {rows.map((rowObj) => (
                    <div key={rowObj.row} className="flex items-center">
                      <div className="w-8 text-right mr-4 text-xs font-bold text-on-surface-variant/50">
                        {rowObj.row}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rowObj.seats.map((seat, i) => (
                          <Seat
                            key={i}
                            seat={seat}
                            row={rowObj.row}
                            selectedSeats={selectedSeats}
                            lockedSeats={lockedSeats}
                            isPremium={type === "PREMIUM" || type === "VIP"}
                            onClick={() => handleSelectSeat(rowObj.row, seat.number)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 🍿 Widescreen Curved Screen */}
            <div className="flex flex-col items-center mt-12 mb-16 w-full">
              <div className="theater-screen mb-3"></div>
              <p className="text-[10px] text-on-surface-variant/60 tracking-widest uppercase font-black text-center">
                All eyes this way (Screen)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <Footer
          isSelected={isSelectedSeats}
          selectedSeats={selectedSeats}
          showData={showData}
          state={location}
        />
      </div>
    </div>
  );
};

export default SeatLayout;

