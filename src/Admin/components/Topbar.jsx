// src/admin/components/Topbar.jsx
import React from "react";
import {
  Bars3Icon as MenuIcon,
  BellIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ya sirf token hata: localStorage.removeItem("token")
    navigate("/"); // login route pe redirect
  };

  const user = {
    name: "Pradip",
  };
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#527557] lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Search bar */}
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#527557]"
          >
            <span className="sr-only">Logout</span>
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-black" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#527557] flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
