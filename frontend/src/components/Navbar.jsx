import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { LuSearch } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";

const Navbar = () => {
  const [visible, setVisible] = useState(false); //for sidebar menu

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-44" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm" style={{ color: "#40350A" }}>
        {/* NavLink is used to navigate to different pages */}
        {/* jis link me actively present hoge usme automatically active classname add ho jaega due to NavLink */}
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#40350A] hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#40350A] hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#40350A] hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#40350A] hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <LuSearch
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          className="cursor-pointer"
          color="#40350A"
          size={24}
          // style={{ width: "24px", height: "24px" }} // You can increase to 28px or 32px as needed
        />

        <div className="group relative">
          <FaUserCircle
            onClick={() => (token ? null : navigate("/login"))}
            className="cursor-pointer"
            size={24} // you can change size as needed
            color="#40350A"
          />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div
                className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 rounded"
                style={{ color: "#A1876F" }}
              >
                <p className="cursor-pointer hover:text-[#40350A]">
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-[#40350A]"
                >
                  Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:text-[#40350A]"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <FaCartShopping size={22} color="#40350A" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#40350A] text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        {/* only visible for small screen */}
        <LuMenu
          onClick={() => setVisible(true)}
          className="sm:hidden cursor-pointer"
          size={25}
          color="#40350A"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        {/* dynamic classname visible true for small screen only */}
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          {/* setVisible false hua to ${visible ? 'w-full' : 'w-0' ye wla work krega means menu ht jaega */}
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
