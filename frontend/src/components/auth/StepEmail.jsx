import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BeatLoader } from 'react-spinners';

const StepEmail = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const { sendOtpRequest, otpLoader } = useAuth();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;
    sendOtpRequest({ email, onNext });
  };

  return (
    <div className="flex flex-col gap-5 text-on-surface">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Enter your email</h3>
        <p className="text-xs text-on-surface-variant/80">
          If you don't have an account, we'll create one for you.
        </p>
      </div>

      {/* Input Group */}
      <div className="flex items-center bg-surface-container-high/40 rounded-xl px-4 py-3 border border-outline-variant/40 focus-within:border-primary-container transition-all">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-grow bg-transparent border-none outline-none text-sm text-white placeholder:text-on-surface-variant/50 focus:ring-0 w-full"
          required
        />
      </div>

      {/* Action Button */}
      <button
        type="submit"
        onClick={handleSendOtp}
        disabled={otpLoader}
        className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all primary-glow flex items-center justify-center cursor-pointer disabled:opacity-50"
      >
        {otpLoader ? <BeatLoader size={8} color="white" /> : "Continue"}
      </button>

      {/* Footer disclaimer */}
      <p className="text-[10px] text-on-surface-variant/40 text-center leading-relaxed max-w-[280px] mx-auto">
        By entering your email, you agree to our{" "}
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

export default StepEmail;