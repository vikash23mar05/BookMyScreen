import React from "react";
import { MdChair, MdPayment } from "react-icons/md";
import { FiCalendar, FiMapPin, FiFilm } from "react-icons/fi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserBookings } from "../../apis";
import dayjs from "dayjs";
import Loader from "../shared/Loader";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      return await getUserBookings();
    },
    placeholderData: keepPreviousData,
  });

  const bookingsList = (data?.data?.bookings || []).filter(
    (booking) => booking && booking.showId && booking.showId.movie && booking.showId.theater
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="medium" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-outline-variant/30 text-center">
        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">Your Bookings</h3>
        <p className="text-sm text-on-surface-variant/80">Failed to load bookings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Your Bookings</h3>

      {bookingsList.length === 0 ? (
        <div className="glass-card p-12 rounded-[28px] border border-outline-variant/30 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
          <div className="text-4xl text-on-surface-variant/40">🎟️</div>
          <h4 className="text-lg font-bold text-white">No Bookings Yet</h4>
          <p className="text-sm text-on-surface-variant/80 max-w-sm">
            You haven't booked any movie tickets yet. Start exploring the latest movies in your area!
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all primary-glow cursor-pointer"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        bookingsList.flatMap((booking) =>
          booking.seats.map((seat) => (
            <div
              key={`${booking._id}-${seat}`}
              className="glass-card p-6 rounded-[24px] border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden"
            >
              {/* Ticket Details Wrapper */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Ticket Shaped Poster */}
              <div 
                className="flex-shrink-0 relative animate-pulse-once"
                style={{ filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4))" }}
              >
                <img
                  src={booking.showId?.movie?.posterUrl}
                  alt={booking.showId?.movie?.title}
                  className="w-24 h-36 object-cover object-top"
                  style={{ clipPath: "url(#ticket-clip)" }}
                />
              </div>

              {/* Dotted Ticket Divider (visible on desktop md and up) */}
              <div className="hidden md:block h-36 border-l border-dashed border-outline-variant/50"></div>

              {/* Main Text Content */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h4 className="text-lg font-black text-white leading-tight">
                      {booking.showId?.movie?.title}
                    </h4>
                    <p className="text-xs text-primary-container font-black tracking-widest uppercase mt-1">
                      {booking.showId?.movie?.format?.join(" | ")}
                    </p>
                  </div>
                  <span className="bg-primary-container/10 border border-primary-container/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-primary-container">
                    M-Ticket
                  </span>
                </div>

                {/* Meta details list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-on-surface-variant/80">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-primary-container" size={14} />
                    <span>
                      {dayjs(booking.showId?.date, "DD-MM-YYYY").format("D MMMM YYYY")} • {booking.showId?.startTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-primary-container" size={14} />
                    <span className="truncate">
                      {booking.showId?.theater?.name}, {booking.showId?.theater?.city}
                    </span>
                  </div>
                </div>

                {/* Seat tags */}
                <div className="flex items-start gap-2.5 text-xs">
                  <MdChair className="text-primary-container mt-0.5 flex-shrink-0" size={16} />
                  <div className="space-y-1 font-semibold">
                    <span className="text-white">Seat: </span>
                    <span className="text-on-surface-variant font-bold">
                      {seat}
                    </span>
                    <span className="text-xs text-on-surface-variant/60 ml-2 font-medium">
                      (1 Ticket)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dotted Ticket Divider for QR (visible on desktop md and up) */}
              <div className="hidden md:block h-36 border-l border-dashed border-outline-variant/50"></div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-xl border border-outline-variant/20 shadow-md w-24 h-24 flex-shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${booking.bookingRef}-${seat}&color=000000&bgcolor=FFFFFF`}
                  alt="Ticket QR Code"
                  className="w-[72px] h-[72px]"
                />
                <span className="text-[8px] font-black text-black/60 tracking-wider mt-0.5 uppercase select-none">Scan Entry</span>
              </div>
            </div>

            {/* Price Info Banner */}
            <div className="bg-surface-container-high/40 p-4 rounded-xl flex flex-wrap justify-between items-center text-xs font-semibold border border-outline-variant/10 gap-2">
              <span className="text-on-surface-variant/70">
                Tickets Base Price: <strong className="text-white">₹{booking.bookingFee?.ticketPrice}</strong> • Convenience Fee: <strong className="text-white">₹{booking.bookingFee?.convenience}</strong>
              </span>
              <span className="text-sm font-black text-white">
                Total Paid: <span className="text-primary-container text-base ml-1">₹{booking.bookingFee?.total}</span>
              </span>
            </div>

            {/* Transaction metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low/30 p-4 rounded-xl border border-outline-variant/15 text-xs text-on-surface-variant/80 font-medium">
              <div>
                <p className="font-bold text-on-surface-variant/50 text-[10px] uppercase tracking-wide">Booking Date</p>
                <p className="text-white font-semibold mt-0.5">
                  {dayjs(booking.bookingDateTime).format("DD MMM YYYY, h:mm A")}
                </p>
              </div>
              <div>
                <p className="font-bold text-on-surface-variant/50 text-[10px] uppercase tracking-wide">Payment Method</p>
                <p className="text-white font-semibold mt-0.5 uppercase flex items-center gap-1">
                  <MdPayment className="text-primary-container" /> {booking.paymentMethod}
                </p>
              </div>
              <div>
                <p className="font-bold text-on-surface-variant/50 text-[10px] uppercase tracking-wide">Booking ID</p>
                <p className="text-white font-semibold mt-0.5 tracking-wider">
                  {booking.bookingRef}
                </p>
              </div>
            </div>

            {/* Ambient background blur dot */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary-container/5 blur-[50px] rounded-full"></div>
          </div>
        )))
      )}

      {/* SVG ClipPath Definition for Ticket Shape */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="ticket-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 H 1 V 0.42 A 0.08 0.08 0 0 0 1,0.58 V 1 H 0 V 0.58 A 0.08 0.08 0 0 0 0,0.42 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default BookingHistory;
