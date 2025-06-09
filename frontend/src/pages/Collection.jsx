import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";

const Collection = () => {
  const { products, search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/category/get`);
        if (res.data.success) {
          setAllCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (val) => {
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
    setSubCategory([]);
  };

  const toggleSubCategory = (val) => {
    setSubCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relavent");
  };

  const applyFilter = () => {
    let productsCopy = [...products];

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter (lowercase comparison)
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category.toLowerCase()) // Ensure category is in lowercase
      );
    }

    // Subcategory filter (lowercase comparison)
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory.toLowerCase()) // Ensure subcategory is in lowercase
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          style={{ color: "#40350A" }}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-[#D8C5A1] pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium" style={{ color: "#40350A" }}>
            CATEGORIES
          </p>
          <div className="flex flex-col gap-2 text-sm font-light" style={{ color: "#A1876F" }}>
            {allCategories.map((cat, i) => (
              <label key={i} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat.name}
                  onChange={() => toggleCategory(cat.name.toLowerCase())}
                  checked={category.includes(cat.name.toLowerCase())}
                  style={{ accentColor: "#A1876F" }}
                />
                {capitalize(cat.name)}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        {category.length > 0 && (
          <div className={`border border-[#D8C5A1] pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium" style={{ color: "#40350A" }}>
              TYPE
            </p>
            <div className="flex flex-col gap-2 text-sm font-light" style={{ color: "#A1876F" }}>
              {allCategories
                .find((cat) => cat.name.toLowerCase() === category[0])
                ?.subCategories.map((sub, i) => (
                  <label key={i} className="flex gap-2 cursor-pointer">
                    <input
                      className="w-3"
                      type="checkbox"
                      value={sub}
                      onChange={() => toggleSubCategory(sub.toLowerCase())}
                      checked={subCategory.includes(sub.toLowerCase())}
                      style={{ accentColor: "#A1876F" }}
                    />
                    {capitalize(sub)}
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {(category.length > 0 || subCategory.length > 0) && (
          <button onClick={clearFilters} className="ml-5 mt-3 text-sm text-red-600 underline">
            Clear All Filters
          </button>
        )}
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-[#A1876F] text-sm px-2 text-[#40350A]"
            value={sortType}
          >
            <option value="relavent">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;