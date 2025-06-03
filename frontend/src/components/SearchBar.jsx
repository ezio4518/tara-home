import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  //collection me search bar ko dikhana hai baki pages me nahi
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <LuSearch size={16} color="#40350A" />
      </div>
      <IoClose
        onClick={() => setShowSearch(false)}
        className="inline cursor-pointer"
        size={18}
        color="#40350A"
      />
    </div>
  ) : null;
};

export default SearchBar;
