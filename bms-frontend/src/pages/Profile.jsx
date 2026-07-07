import React, { useEffect, useState } from "react";
import { tabs } from "../utils/constants";
import { IoIosLogOut, IoMdAdd } from "react-icons/io";
import { FiEdit, FiUser } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logoutRequest } = useAuth();

  const [gender, setGender] = useState("Man");
  const [isMarried, setIsMarried] = useState("No");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    if (tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleLogout = () => {
    logoutRequest();
    navigate("/");
  };

  const handleTabChange = (t) => {
    setActiveTab(t);
    navigate(`/profile/${user?._id}/${t}`);
  };

  return (
    <div className="bg-background min-h-screen text-on-surface pt-[80px] pb-12">
      {/* Sub Header / Tabs Navigation */}
      <div className="glass-card border-b border-outline-variant/30 py-3 px-6 sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto flex gap-8 text-sm font-bold tracking-wider">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`pb-1 border-b-2 cursor-pointer transition-all capitalize ${
                activeTab === t
                  ? "text-primary-container border-primary-container"
                  : "text-on-surface-variant/70 border-transparent hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* User Profile Header Card */}
            <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-outline-variant/30 relative overflow-hidden">
              <div className="relative w-20 h-20 border-4 border-outline-variant/40 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant shadow-lg flex-shrink-0">
                <FiUser size={36} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-black text-white mb-1">Hi, {user?.name || "Premium User"}</h2>
                <p className="text-xs text-on-surface-variant font-medium">Enjoy premium movie booking experiences.</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-primary-container/10 border border-primary-container/30 text-primary-container hover:bg-primary-container hover:text-on-primary-container px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <IoIosLogOut size={18} /> Logout
              </button>
              {/* Background gradient blob for aesthetics */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Details */}
              <div className="glass-card p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-5">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <p className="text-xs font-semibold text-on-surface-variant/80">Email Address</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white font-medium">{user?.email}</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold">
                        Verified
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-on-surface-variant/80">Mobile Number</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white font-medium">+91-{user?.phone || "XXXXXXXXXX"}</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details Info */}
              <div className="glass-card p-6 rounded-2xl border border-outline-variant/30">
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-5">Personal Details</h3>
                <div className="space-y-4 text-xs font-medium text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Full Name</span>
                    <span className="text-white font-bold">{user?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date of Birth</span>
                    <span className="text-white font-bold">{birthday || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender</span>
                    <span className="text-white font-bold">{gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marital Status</span>
                    <span className="text-white font-bold">{isMarried === "Yes" ? "Married" : "Single"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Form Card */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-outline-variant/30">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Update Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant/80 uppercase">Name</label>
                  <input
                    type="text"
                    value={user?.name}
                    readOnly
                    className="w-full mt-1.5 bg-surface-container-high/40 text-on-surface-variant/50 border border-outline-variant/30 rounded-xl px-4 py-2.5 outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant/80 uppercase">Birthday</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full mt-1.5 bg-surface-container-high/40 text-white border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-2.5 outline-none font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant/80 uppercase">Gender</label>
                  <div className="flex gap-3 mt-1.5">
                    {["Man", "Woman"].map((g) => {
                      const isActive = gender === g;
                      return (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary-container text-on-primary-container border-primary-container shadow-md"
                              : "border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:text-white"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant/80 uppercase">Married?</label>
                  <div className="flex gap-3 mt-1.5">
                    {["Yes", "No"].map((m) => {
                      const isActive = isMarried === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setIsMarried(m)}
                          className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary-container text-on-primary-container border-primary-container shadow-md"
                              : "border-outline-variant/40 text-on-surface-variant hover:border-outline-variant hover:text-white"
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "booking" && <BookingHistory />}
      </div>
    </div>
  );
};

export default Profile;
