import React from "react";
import { IoClose } from "react-icons/io5";
import mainWhiteLogo from "../../assets/main-icon-white.png"; // Adjust the path
import { useAuth } from "../../context/AuthContext";
import StepEmail from "../auth/StepEmail";
import StepOTP from "../auth/StepOTP";
import StepAccountCreation from "../auth/StepAccountCreation";

const steps = {
  1: StepEmail,
  2: StepOTP,
  3: StepAccountCreation,
};

const SignInModel = () => {
  const { step, setStep, showModal, toggleModal } = useAuth();

  const Step = steps[step];

  const onNext = () => {
    setStep(step + 1);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-[95%] sm:w-[90%] max-w-md bg-[#0f1115] border border-outline-variant/40 rounded-[28px] shadow-2xl animate-fadeIn overflow-hidden relative flex flex-col">
        {/* Top Header Section */}
        <div className="bg-gradient-to-b from-[#e61e50]/20 to-transparent text-white px-6 py-8 relative flex flex-col items-center justify-center border-b border-outline-variant/10 font-bold">
          <button
            onClick={() => toggleModal()}
            className="absolute top-4 right-4 text-on-surface-variant/80 hover:text-white transition-colors cursor-pointer"
          >
            <IoClose className="text-2xl" />
          </button>
          <img
            src={mainWhiteLogo}
            alt="bookMyScreen"
            className="h-16 object-contain mb-3 drop-shadow-[0_0_15px_rgba(230,30,80,0.3)]"
          />
          <h2 className="text-xl font-black tracking-tight text-white">Book<span className="text-primary-container">My</span>Screen</h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">Where movies meet magic.</p>
        </div>

        {/* Dynamic Auth Steps */}
        <div className="p-6 md:p-8">
          <Step onNext={onNext} />
        </div>
      </div>
    </div>
  );
};

export default SignInModel;
