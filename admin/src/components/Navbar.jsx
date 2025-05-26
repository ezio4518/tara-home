import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      {/* ✅ Wrap logo in Link */}
      <Link to="/">
        <img
          className="w-[max(30%,120px)] cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />
      </Link>

      <button
        onClick={() => setToken("")}
        className="bg-[#40350A] text-[#F0E1C6] px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
