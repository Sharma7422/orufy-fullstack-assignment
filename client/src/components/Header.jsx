import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authValue");
    navigate("/login");
  };

  const userInitial = (user?.email || user?.phone || "U")[0].toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200  flex items-center justify-between px-3 md:px-6 lg:px-8 z-30 sticky top-0">
      {}
      <div className="flex lg:hidden flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

    </header>
  );
}
