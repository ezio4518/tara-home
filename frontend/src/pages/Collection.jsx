// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import Title from "../components/Title";
// import ProductItem from "../components/ProductItem";
// import axios from "axios";

// const Collection = () => {
//   const { products, search, showSearch, backendUrl } = useContext(ShopContext);

//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [company, setCompany] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState("relavent");
//   const [allCategories, setAllCategories] = useState([]);

//   const isValid = (val) => val && val.trim() !== "" && val.toLowerCase() !== "n/a";

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/category/get`);
//         if (res.data.success) setAllCategories(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const toggleCategory = (val) => {
//     setCategory((prev) =>
//       prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
//     );
//     setCompany([]);
//     setSubCategory([]);
//   };

//   const toggleCompany = (val) => {
//     setCompany((prev) =>
//       prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
//     );
//     setSubCategory([]);
//   };

//   const toggleSubCategory = (val) => {
//     setSubCategory((prev) =>
//       prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
//     );
//   };

//   const clearFilters = () => {
//     setCategory([]);
//     setCompany([]);
//     setSubCategory([]);
//     setSortType("relavent");
//   };

//   const applyFilter = () => {
//     let productsCopy = [...products];

//     if (showSearch && search) {
//       productsCopy = productsCopy.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     if (category.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         category.includes(item.category?.toLowerCase())
//       );
//     }
//     if (company.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         company.includes(item.company?.toLowerCase())
//       );
//     }
//     if (subCategory.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         subCategory.includes(item.subCategory?.toLowerCase())
//       );
//     }

//     setFilterProducts(productsCopy);
//   };

//   const sortProduct = () => {
//     let fpCopy = [...filterProducts];
//     switch (sortType) {
//       case "low-high":
//         setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
//         break;
//       case "high-low":
//         setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
//         break;
//       default:
//         applyFilter();
//         break;
//     }
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, company, subCategory, search, showSearch, products]);

//   useEffect(() => {
//     sortProduct();
//   }, [sortType]);

//   const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter(!showFilter)}
//           className="my-2 text-xl flex items-center cursor-pointer gap-2"
//           style={{ color: "#40350A" }}
//         >
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             src={assets.dropdown_icon}
//             alt=""
//           />
//         </p>

//         {/* Category Filter */}
//         {allCategories.filter(cat => isValid(cat.name)).length > 0 && (
//           <div className={`border border-[#D8C5A1] pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
//             <p className="mb-3 text-sm font-medium" style={{ color: "#40350A" }}>CATEGORIES</p>
//             <div className="flex flex-col gap-2 text-sm font-light" style={{ color: "#A1876F" }}>
//               {allCategories.filter(cat => isValid(cat.name)).map((cat, i) => (
//                 <label key={i} className="flex gap-2 cursor-pointer">
//                   <input
//                     className="w-3"
//                     type="checkbox"
//                     value={cat.name}
//                     onChange={() => toggleCategory(cat.name.toLowerCase())}
//                     checked={category.includes(cat.name.toLowerCase())}
//                     style={{ accentColor: "#A1876F" }}
//                   />
//                   {capitalize(cat.name)}
//                 </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Company Filter */}
//         {category.length === 1 &&
//           allCategories.find(cat => cat.name.toLowerCase() === category[0])
//             ?.companies.filter(comp => isValid(comp.companyName)).length > 0 && (
//           <div className={`border border-[#D8C5A1] pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
//             <p className="mb-3 text-sm font-medium" style={{ color: "#40350A" }}>COMPANIES</p>
//             <div className="flex flex-col gap-2 text-sm font-light" style={{ color: "#A1876F" }}>
//               {allCategories.find(cat => cat.name.toLowerCase() === category[0])
//                 ?.companies.filter(comp => isValid(comp.companyName)).map((comp, i) => (
//                   <label key={i} className="flex gap-2 cursor-pointer">
//                     <input
//                       className="w-3"
//                       type="checkbox"
//                       value={comp.companyName}
//                       onChange={() => toggleCompany(comp.companyName.toLowerCase())}
//                       checked={company.includes(comp.companyName.toLowerCase())}
//                       style={{ accentColor: "#A1876F" }}
//                     />
//                     {capitalize(comp.companyName)}
//                   </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* SubCategory Filter */}
//         {category.length === 1 && company.length === 1 &&
//           allCategories.find(cat => cat.name.toLowerCase() === category[0])
//             ?.companies.find(comp => comp.companyName.toLowerCase() === company[0])
//             ?.subCategories.filter(sub => isValid(sub.name)).length > 0 && (
//           <div className={`border border-[#D8C5A1] pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}>
//             <p className="mb-3 text-sm font-medium" style={{ color: "#40350A" }}>TYPES</p>
//             <div className="flex flex-col gap-2 text-sm font-light" style={{ color: "#A1876F" }}>
//               {allCategories.find(cat => cat.name.toLowerCase() === category[0])
//                 ?.companies.find(comp => comp.companyName.toLowerCase() === company[0])
//                 ?.subCategories.filter(sub => isValid(sub.name)).map((sub, i) => (
//                   <label key={i} className="flex gap-2 cursor-pointer">
//                     <input
//                       className="w-3"
//                       type="checkbox"
//                       value={sub.name}
//                       onChange={() => toggleSubCategory(sub.name.toLowerCase())}
//                       checked={subCategory.includes(sub.name.toLowerCase())}
//                       style={{ accentColor: "#A1876F" }}
//                     />
//                     {capitalize(sub.name)}
//                   </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {(category.length > 0 || company.length > 0 || subCategory.length > 0) && (
//           <button onClick={clearFilters} className="ml-5 mt-3 text-sm text-red-600 underline">
//             Clear All Filters
//           </button>
//         )}
//       </div>

//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <Title text1={"ALL"} text2={"COLLECTIONS"} />
//           <select
//             onChange={(e) => setSortType(e.target.value)}
//             className="border-2 border-[#A1876F] text-sm px-2 text-[#40350A]"
//             value={sortType}
//           >
//             <option value="relavent">Sort by: Relevance</option>
//             <option value="low-high">Sort by: Low to High</option>
//             <option value="high-low">Sort by: High to Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
//           {filterProducts.map((item, index) => (
//             <ProductItem
//               key={index}
//               name={item.name}
//               id={item._id}
//               price={item.price}
//               image={item.image}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";

// Utility to normalize MongoDB ObjectId or string
function getId(x) {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (x.$oid) return x.$oid;
  if (x._id) return x._id;
  return String(x);
}

// VERTICAL CATEGORY FILTER TREE (NO Selected: ... shown)
const CategoryFilterTree = ({
  categories,
  selectedCategoryPath,
  setSelectedCategoryPath,
  onClear,
}) => {
  // Build options per level
  const buildLevels = () => {
    let levels = [];
    let parent = "";
    for (let i = 0; ; ++i) {
      let options = categories
        .filter((cat) => getId(cat.parent) === parent)
        .map((cat) => ({ _id: getId(cat._id), name: cat.name }));
      if (options.length === 0) break;
      levels.push(options);
      parent = selectedCategoryPath[i] || "";
      if (!parent) break;
    }
    // If last level is selected, add next level even if empty
    if (
      levels.length === 0 ||
      (levels.length === selectedCategoryPath.length &&
        selectedCategoryPath[selectedCategoryPath.length - 1])
    ) {
      const parentId = selectedCategoryPath[selectedCategoryPath.length - 1] || "";
      const childOptions = categories
        .filter((cat) => getId(cat.parent) === parentId)
        .map((cat) => ({ _id: getId(cat._id), name: cat.name }));
      if (childOptions.length) levels.push(childOptions);
    }
    return levels;
  };
  const handleChange = (levelIdx, value) => {
    let newPath = selectedCategoryPath.slice(0, levelIdx);
    if (value) newPath.push(value);
    setSelectedCategoryPath(newPath);
  };
  const levels = buildLevels();
  return (
    <div className="mb-4">
      <div
        className="font-semibold mb-3 text-lg"
        style={{ color: "#40350A", letterSpacing: "0.5px" }}
      >
        CATEGORIES
      </div>
      <div className="flex flex-col gap-3 mb-2">
        {levels.map((opts, idx) => (
          <select
            key={idx}
            className="border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
            value={selectedCategoryPath[idx] || ""}
            onChange={(e) => handleChange(idx, e.target.value)}
            style={{
              borderColor: "#A1876F",
              color: "#40350A",
              backgroundColor: "#FCFCFC",
              fontWeight: 500,
            }}
          >
            <option value="">Select...</option>
            {opts.map((cat) => (
              <option value={cat._id} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        ))}
      </div>
      <button
        onClick={onClear}
        className="text-base px-0 py-0"
        style={{
          color: "#d32f2f",
          fontWeight: 500,
          textDecoration: "underline",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        type="button"
      >
        Clear All Filters
      </button>
    </div>
  );
};

const Collection = () => {
  const { products, search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${backendUrl}/api/category/all`)
      .then((res) => {
        if (res.data.success) setCategories(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [backendUrl]);

  // Find all descendant category IDs of a given category
  const getDescendantCategoryIds = (catId) => {
    let result = [catId];
    let queue = [catId];
    while (queue.length) {
      const curr = queue.shift();
      categories.forEach((cat) => {
        if (getId(cat.parent) === curr) {
          result.push(getId(cat._id));
          queue.push(getId(cat._id));
        }
      });
    }
    return result;
  };

  // Get normalized category id from product object
  const getProductCategoryId = (prod) => {
    if (!prod.category) return "";
    if (typeof prod.category === "string") return prod.category;
    if (prod.category.$oid) return prod.category.$oid;
    if (prod.category._id) return prod.category._id;
    return String(prod.category);
  };

  useEffect(() => {
    let filtered = [...products];
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategoryPath.length > 0 && selectedCategoryPath.some(Boolean)) {
      const lastIdx = selectedCategoryPath.map(Boolean).lastIndexOf(true);
      const selectedId = selectedCategoryPath[lastIdx];
      if (selectedId) {
        const allowedIds = getDescendantCategoryIds(selectedId);
        filtered = filtered.filter((item) =>
          allowedIds.includes(getProductCategoryId(item))
        );
      }
    }
    if (sortType === "low-high") {
      filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filtered = filtered.slice().sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [products, search, showSearch, selectedCategoryPath, sortType, categories]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t bg-[#FCFCFC] min-h-screen">
      {/* FILTER SECTION */}
      <div className="min-w-72 max-w-xs">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold"
          style={{ color: "#40350A" }}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        <div
          className={`border border-[#D8C5A1] rounded-lg pl-6 pr-3 py-5 mt-3 shadow-sm bg-white ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <CategoryFilterTree
            categories={categories}
            selectedCategoryPath={selectedCategoryPath}
            setSelectedCategoryPath={setSelectedCategoryPath}
            onClear={() => setSelectedCategoryPath([])}
          />
        </div>
      </div>
      {/* PRODUCTS GRID */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-base sm:text-2xl mb-4 items-center">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-[#A1876F] text-sm px-2 py-2 rounded focus:outline-none"
            style={{ color: "#40350A", background: "#fff" }}
            value={sortType}
          >
            <option value="relavent">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length === 0 ? (
            <div className="col-span-full text-gray-400 text-xl flex justify-center items-center h-40">
              No products found.
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;