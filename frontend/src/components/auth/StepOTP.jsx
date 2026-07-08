import React, { useRef, useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { BeatLoader } from "react-spinners";

const StepOTP = ({ onNext }) => {
  const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
  const inputRef = useRef([]);
  const { verifyOtpRequest, verifyOtpLoader } = useAuth();

  const { displayTime, isExpired } = useCountdown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otp = parseInt(otpArray.join(""), 10);
    verifyOtpRequest(otp, onNext);
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const cleanValue = value.replace(/[^0-9]/g, ""); // Allow only digits
    if (cleanValue !== "") {
      const newOtp = [...otpArray];
      newOtp[index] = cleanValue;
      setOtpArray(newOtp);

      // Focus on next input
      if (index < inputRef.current.length - 1) {
        inputRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // Clear current digit if not empty, otherwise move back and clear
      if (otpArray[index] === "") {
        if (index > 0) {
          const newOtp = [...otpArray];
          newOtp[index - 1] = "";
          setOtpArray(newOtp);
          inputRef.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otpArray];
        newOtp[index] = "";
        setOtpArray(newOtp);
      }
    }
  };

  const handleClearOtp = () => {
    setOtpArray(new Array(4).fill(""));
    inputRef.current[0]?.focus();
  };

  return (
    <div className="flex flex-col gap-5 text-on-surface">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Verify Email</h3>
        <p className="text-xs text-on-surface-variant/80">
          Enter the 4-digit code we just sent to your email.
        </p>
      </div>

      {/* OTP INPUTS */}
      <div className="flex items-center justify-center gap-3">
        {otpArray.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRef.current[index] = ref)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 font-black text-center bg-surface-container-high/40 rounded-xl border border-outline-variant/50 text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-lg"
          />
        ))}

        <button
          onClick={handleClearOtp}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-surface-container-high/20 border border-outline-variant/40 text-primary-container rounded-xl cursor-pointer hover:bg-primary-container/10 transition-colors"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Expiry Countdown */}
      <div className="text-center">
        {isExpired ? (
          <p className="text-xs text-primary-container font-semibold">
            OTP expired.{" "}
            <a href="#" className="underline hover:text-white" onClick={handleResendOtp}>
              Resend OTP
            </a>
          </p>
        ) : (
          <p className="text-xs text-on-surface-variant/70">
            Expires in <span className="text-white font-bold">{displayTime}</span>
          </p>
        )}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        onClick={handleVerifyOtp}
        disabled={verifyOtpLoader}
        className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all primary-glow flex items-center justify-center cursor-pointer disabled:opacity-50"
      >
        {verifyOtpLoader ? <BeatLoader size={8} color="white" /> : "Verify & Continue"}
      </button>

      <p className="text-[10px] text-on-surface-variant/40 text-center leading-relaxed max-w-[280px] mx-auto">
        By entering your code, you agree to our{" "}
        <a href="#" className="text-primary-container hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary-container hover:underline">
          Privacy Policy
        </a>.
      </p>
    </div>
  );
};

export default StepOTP;
