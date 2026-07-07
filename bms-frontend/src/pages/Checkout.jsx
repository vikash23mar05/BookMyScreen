import React, { useEffect, useState } from "react";
import Header from "../components/seat-layout/Header";
import dayjs from "dayjs";
import { calculateTotalPrice, groupSeatsByType } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useSeatContext } from "../context/SeatContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { bookShow } from "../apis/index";
import { socket } from "../utils/socket";

const Checkout = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const navigate = useNavigate();
  const { user, toggleModal } = useAuth();
  const { location } = useLocation();
  const { selectedSeats, shows: showData } = useSeatContext();
  const { base, tax, total } = calculateTotalPrice(selectedSeats);

  useEffect(() => {
    if (!showData || selectedSeats.length === 0) {
      navigate("/");
      return;
    }
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      toggleModal();
      navigate("/");
    }
  }, [showData, selectedSeats, user, navigate, toggleModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (showData && user) {
            socket.emit("unlock-seats", {
              showId: showData._id,
              userId: user._id,
            });
          }
          toast.error("Time expired!");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showData, user, navigate]);

  const bookTicketMutation = useMutation({
    mutationFn: (reqData) => bookShow(reqData),
    onSuccess: (data) => {
      toast.success(data?.data?.message || "Booking Successful!");
      socket.emit("unlock-seats", {
        showId: showData._id,
        userId: user._id,
        seatIds: selectedSeats,
      });
      navigate(`/profile/${user._id}/booking`);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Booking creation failed.");
    },
  });

  const handleBookSeat = () => {
    try {
      const mockPaymentId = `pay_mock_${Date.now()}`;
      const reqData = {
        showId: showData._id,
        seats: selectedSeats,
        paymentId: mockPaymentId,
        bookingFee: {
          ticketPrice: base,
          total: total,
          convenience: tax,
        },
      };
      toast.success("Confirming booking details...");
      bookTicketMutation.mutate(reqData);
    } catch (error) {
      console.log(error);
      toast.error("Booking confirmation failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-on-surface pb-12">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Countdown Timer Banner */}
        <div className="text-center mb-8">
          <p className="inline-block text-primary border border-primary/40 bg-primary/10 rounded-full px-6 py-2 text-sm font-black tracking-widest uppercase">
            Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Section (Booking Info) */}
          <div className="flex-1 space-y-6 w-full">
            {/* Movie Info Card */}
            <div className="glass-card p-6 rounded-2xl flex gap-6 items-center">
              <img
                src={showData?.movie.posterUrl}
                alt={showData?.movie.title}
                className="w-16 h-24 rounded-xl object-cover border border-outline-variant/30 flex-shrink-0 shadow-lg"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 leading-tight">
                  {showData?.movie.title}
                </h3>
                <p className="text-xs text-on-surface-variant/80 font-medium mb-1">
                  {showData?.movie.certification} •{" "}
                  {showData?.movie.languages.join(", ")} •{" "}
                  {showData?.movie.format.join(", ")}
                </p>
                <p className="text-xs text-on-surface-variant/60 font-semibold">
                  {showData?.theater.name}, {showData?.theater.city}
                </p>
              </div>
            </div>

            {/* Show Date Details */}
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-sm font-bold text-white border-b pb-4 border-outline-variant/20 flex justify-between items-center">
                <span>
                  {dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM YYYY")}
                </span>
                <span className="bg-surface-container-high px-3 py-1 rounded-lg text-xs uppercase tracking-widest text-primary-container">
                  {showData?.startTime}
                </span>
              </p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-black text-white">
                    {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""} Selected
                  </p>
                  <div className="text-xs text-on-surface-variant mt-1.5 space-y-0.5 font-medium">
                    {groupSeatsByType(selectedSeats).map(({ type, seats }) => (
                      <p key={type}>
                        {type}: <span className="text-white">{seats.join(", ")}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <p className="text-lg font-black text-white">
                  <span className="text-xs font-semibold mr-0.5 text-on-surface-variant">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="glass-card p-6 rounded-2xl text-on-surface-variant/80 border-l-4 border-yellow-500 bg-yellow-500/5">
              <span className="font-semibold text-xs flex items-center gap-2">
                <FaInfoCircle className="text-yellow-500 flex-shrink-0" size={16} /> 
                No cancellations or refunds are available after tickets are booked.
              </span>
            </div>

            {/* Offers */}
            <div className="flex items-center justify-between glass-card p-6 rounded-2xl">
              <p className="font-bold text-xs text-white flex items-center gap-2 uppercase tracking-wider">
                <BiSolidOffer className="text-primary-container" size={18} /> Available Offers
              </p>
              <p className="text-xs text-primary-container font-black hover:underline cursor-pointer">
                View All
              </p>
            </div>
          </div>

          {/* Right Section (Payment Summary) */}
          <div className="w-full lg:w-[320px] space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="font-bold text-white text-base mb-4 uppercase tracking-wider">
                Payment Summary
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Order Amount</span>
                  <span className="text-white font-bold">₹{base}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium pb-4 border-b border-outline-variant/20">
                  <span>Taxes & Fees (5%)</span>
                  <span className="text-white font-bold">₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2">
                  <span className="text-white">Amount to Pay</span>
                  <span className="text-primary-container">₹{total}</span>
                </div>
              </div>
            </div>

            {/* User details */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-white text-base uppercase tracking-wider">Your Details</h4>
              <div className="flex items-start gap-3 text-xs">
                <CiUser className="text-primary-container mt-0.5 flex-shrink-0" size={18} />
                <div className="space-y-1 font-medium text-on-surface-variant">
                  <p className="font-bold text-white text-sm">{user?.name || "Test User"}</p>
                  <p>+91-{user?.phone || "0000000000"}</p>
                  <p className="break-all">{user?.email || "user@example.com"}</p>
                  <p className="text-primary-container uppercase text-[10px] font-black">
                    {showData?.theater?.city ? `${showData.theater.city}, ${showData.theater.state}` : location}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Booking Button */}
            <div>
              <button
                onClick={handleBookSeat}
                className="w-full bg-primary-container text-on-primary-container py-3.5 rounded-xl font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform primary-glow flex items-center justify-between px-6 cursor-pointer"
              >
                <span>₹{total}</span>
                <span className="uppercase tracking-widest text-xs font-black">Confirm Booking</span>
              </button>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-outline-variant/10 text-on-surface-variant/50 hover:text-white transition-colors">
              <CiCircleQuestion size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
