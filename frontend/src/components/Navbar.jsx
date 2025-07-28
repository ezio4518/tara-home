import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { LuSearch, LuMenu } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { RiCopperCoinFill } from "react-icons/ri";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCoinInfo, setShowCoinInfo] = useState(false);
  const popupRef = useRef(null);
  const menuIconRef = useRef(null);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    coin,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(e.target)
      ) {
        setVisible(false);
        setShowProfileMenu(false);
        setShowCoinInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 gap-4.5 font-medium relative">
      <Link to="/">
        <img src={assets.logo} className="w-44" alt="logo" />
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden sm:flex gap-5 text-sm" style={{ color: "#40350A" }}>
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

      {/* Right Icons */}
      <div className="flex items-center gap-2.5 sm:gap-6">
        {/* Tara Coin */}
        <div
          className="relative inline-block"
          onMouseEnter={() => setShowCoinInfo(true)}
          onMouseLeave={() => setShowCoinInfo(false)}
        >
          <button
            onClick={() => setShowCoinInfo((prev) => !prev)}
            className="group flex items-center gap-2 px-3 py-1 rounded-full border border-[#40350A] text-[#40350A] hover:bg-[#40350A] hover:text-white transition-colors"
          >
            <RiCopperCoinFill size={22} />
            <span className="text-sm font-medium">{coin}</span>
          </button>
          {showCoinInfo && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-md bg-white border border-[#40350A] px-3 py-2 text-sm text-[#40350A] shadow-md z-50">
              This is Tara Coin — 5% of your order value will be credited as
              Tara Coins. Use them to reduce your future bills.
            </div>
          )}
        </div>

        {/* Search */}
        <LuSearch
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          className="cursor-pointer"
          color="#40350A"
          size={24}
        />

        {/* Desktop Profile */}
        <div ref={popupRef} className="relative hidden sm:block">
          <FaUserCircle
            onClick={() =>
              token ? setShowProfileMenu((prev) => !prev) : navigate("/login")
            }
            className="cursor-pointer"
            size={24}
            color="#40350A"
          />
          {token && showProfileMenu && (
            <div className="absolute right-0 pt-4 z-40">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 rounded text-[#A1876F]">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="cursor-pointer hover:text-[#40350A]"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setShowProfileMenu(false);
                  }}
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

        {/* Cart */}
        <Link to="/cart" className="relative">
          <FaCartShopping size={22} color="#40350A" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#40350A] text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Sidebar Toggle */}
        <LuMenu
          ref={menuIconRef}
          onClick={(e) => {
            e.stopPropagation();
            setVisible((prev) => !prev);
          }}
          className="sm:hidden cursor-pointer"
          size={25}
          color="#40350A"
        />
      </div>

      {/* Mobile Menu */}
      {visible && (
        <div
          ref={popupRef}
          className="fixed top-24 right-6 w-[280px] bg-white border border-[#A1876F] shadow-xl rounded-xl p-4 z-50 flex flex-col"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-[#40350A]">Menu</h3>
            <button
              onClick={() => setVisible(false)}
              className="text-xl text-[#A1876F] hover:text-[#40350A]"
            >
              &times;
            </button>
          </div>

          {["/", "/collection", "/about", "/contact"].map((path, index) => {
            const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-2 px-2 rounded transition-all duration-200 ${
                    isActive
                      ? "bg-[#40350A] text-white"
                      : "text-[#40350A] hover:bg-[#F5F2EF]"
                  }`
                }
              >
                {labels[index]}
              </NavLink>
            );
          })}

          {/* Show Login if user is not logged in */}
          {!token && (
            <NavLink
              to="/login"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-2 px-2 rounded transition-all duration-200 ${
                  isActive
                    ? "bg-[#40350A] text-white"
                    : "text-[#40350A] hover:bg-[#F5F2EF]"
                }`
              }
            >
              LOGIN
            </NavLink>
          )}

          {/* Mobile Profile Dropdown */}
          {token && (
            <div className="mt-1">
              <p
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex justify-between items-center py-2 px-2 rounded hover:bg-[#F5F2EF] text-[#40350A] cursor-pointer transition-colors duration-150"
              >
                <span>PROFILE</span>
                <span>{showProfileMenu ? "▲" : "▼"}</span>
              </p>
              {showProfileMenu && (
                <div className="flex flex-col ml-4 mt-1 text-sm text-[#40350A] bg-[#FAF8F6] rounded-lg shadow border border-[#E1D6C9]">
                  <NavLink
                    to="/profile"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setVisible(false);
                    }}
                    className={({ isActive }) =>
                      `py-2 px-3 rounded transition-all duration-200 ${
                        isActive
                          ? "bg-[#40350A] text-white"
                          : "text-[#40350A] hover:bg-[#F5F2EF]"
                      }`
                    }
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setVisible(false);
                    }}
                    className={({ isActive }) =>
                      `py-2 px-3 rounded transition-all duration-200 ${
                        isActive
                          ? "bg-[#40350A] text-white"
                          : "text-[#40350A] hover:bg-[#F5F2EF]"
                      }`
                    }
                  >
                    Orders
                  </NavLink>
                  <p
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="py-2 px-3 rounded hover:bg-[#F5F2EF] cursor-pointer transition-colors duration-150"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
