import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authValue");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isHome = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const isProducts = location.pathname === "/dashboard/products";

  return (
    <div className={`fixed left-0 top-0 h-screen bg-[#1F2937] w-64 transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      {/* Header with Logo and Close Button */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div onClick={() => handleNavigation("/dashboard")} className="cursor-pointer">
          <Logo size="md" />
        </div>
        {/* Close Button - Mobile Only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search Bar - Hidden on small screens */}
      <div className="hidden md:block p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 bg-[#374151] text-white text-sm rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-2 px-4">
        <button
          onClick={() => handleNavigation("/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isHome
              ? "bg-[#374151] text-white"
              : "text-gray-400 hover:text-white hover:bg-[#2D3748]"
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-sm font-medium">Home</span>
        </button>

        <button
          onClick={() => handleNavigation("/dashboard/products")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isProducts
              ? "bg-[#374151] text-white"
              : "text-gray-400 hover:text-white hover:bg-[#2D3748]"
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
            <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M6.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
          <span className="text-sm font-medium">Products</span>
        </button>
      </nav>

    </div>
  );
}
