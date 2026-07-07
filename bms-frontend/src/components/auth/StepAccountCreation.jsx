import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BeatLoader } from "react-spinners";

const StepAccountCreation = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { activateUserRequest, activateUserLoader } = useAuth();

  const handleActivateAccount = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    activateUserRequest({ name, phone });
  };

  return (
    <div className="flex flex-col gap-5 text-on-surface">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Account Creation</h3>
        <p className="text-xs text-on-surface-variant/80">
          Complete your profile details to finish signing up.
        </p>
      </div>

      {/* Name Input */}
      <div className="flex items-center bg-surface-container-high/40 rounded-xl px-4 py-3 border border-outline-variant/40 focus-within:border-primary-container transition-all">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="flex-grow bg-transparent border-none outline-none text-sm text-white placeholder:text-on-surface-variant/50 focus:ring-0 w-full"
          required
        />
      </div>

      {/* Phone Input */}
      <div className="flex items-center bg-surface-container-high/40 rounded-xl px-4 py-3 border border-outline-variant/40 focus-within:border-primary-container transition-all">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="flex-grow bg-transparent border-none outline-none text-sm text-white placeholder:text-on-surface-variant/50 focus:ring-0 w-full"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleActivateAccount}
        disabled={activateUserLoader}
        className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all primary-glow flex items-center justify-center cursor-pointer disabled:opacity-50"
      >
        {activateUserLoader ? <BeatLoader size={8} color="white" /> : "Create Account"}
      </button>

      <p className="text-[10px] text-on-surface-variant/40 text-center leading-relaxed max-w-[280px] mx-auto">
        By creating your profile, you agree to our{" "}
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

export default StepAccountCreation;
