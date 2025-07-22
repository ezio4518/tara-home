import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

// DYNAMIC CATEGORY SELECTOR with delete per level!
function DynamicCategorySelector({ onSelect, value }) {
  const [levels, setLevels] = useState([
    { parentId: null, options: [], selected: "", adding: false },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initial fetch for root
  useEffect(() => {
    fetchOptions(null, 0);
    // eslint-disable-next-line
  }, []);

  // Fetch options for a given parent and level
  const fetchOptions = async (parentId, level) => {
    const url = parentId
      ? `${backendUrl}/api/category/children/${parentId}`
      : `${backendUrl}/api/category/roots`;
    const res = await axios.get(url);
    setLevels((ls) => {
      const newLs = ls.slice(0, level + 1);
      newLs[level] = { ...newLs[level], options: res.data.data, selected: "", adding: false };
      // Always push a new empty level so user can add children to a parent with 0 children
      if (newLs.length === level + 1) {
        newLs.push({ parentId: null, options: [], selected: "", adding: false });
      }
      return newLs;
    });
  };

  // Handle select (including "+ Add New")
  const handleSelect = (levelIdx, nodeId) => {
    if (nodeId === "add_new") {
      setLevels((ls) => {
        const newLs = ls.slice(0, levelIdx + 1);
        newLs[levelIdx].adding = true;
        return newLs;
      });
      setNewCategoryName("");
    } else {
      setLevels((ls) => {
        const newLs = ls.slice(0, levelIdx + 1);
        newLs[levelIdx].selected = nodeId;
        newLs[levelIdx].adding = false;
        // After a valid select, clear any deeper levels
        newLs.length = levelIdx + 2;
        newLs[levelIdx + 1] = { parentId: nodeId, options: [], selected: "", adding: false };
        return newLs;
      });
      fetchOptions(nodeId, levelIdx + 1);
      onSelect(nodeId);
    }
  };

  // Add a new category at this level
  const handleAddNew = async (levelIdx) => {
    if (!newCategoryName.trim()) return;
    const parentId = levelIdx === 0 ? null : levels[levelIdx - 1]?.selected || null;
    const type = "category";
    try {
      const res = await axios.post(`${backendUrl}/api/category/create`, {
        name: newCategoryName.trim(),
        parentId,
        type,
      });
      const newNode = res.data.data;
      setLevels((ls) => {
        const newLs = ls.slice(0, levelIdx + 2); // Only keep up to this level
        newLs[levelIdx].options = [...(newLs[levelIdx].options || []), newNode];
        newLs[levelIdx].selected = newNode._id;
        newLs[levelIdx].adding = false;
        // After add, prep empty next level for children
        newLs[levelIdx + 1] = { parentId: newNode._id, options: [], selected: "", adding: false };
        return newLs;
      });
      setNewCategoryName("");
      fetchOptions(newNode._id, levelIdx + 1);
      onSelect(newNode._id);
    } catch (err) {
      toast.error("Failed to add new category: " + (err?.response?.data?.message || err.message));
    }
  };

  // Delete a category at this level (deletes all descendants)
  const deleteCategory = async (levelIdx) => {
    const nodeId = levels[levelIdx].selected;
    if (!nodeId) return;
    if (!window.confirm("Delete this category and ALL its subcategories?")) return;
    try {
      await axios.delete(`${backendUrl}/api/category/delete/${nodeId}`);
      // After delete, refresh that level and above
      if (levelIdx === 0) {
        fetchOptions(null, 0);
      } else {
        const parentId = levels[levelIdx - 1]?.selected || null;
        fetchOptions(parentId, levelIdx);
      }
      // Reset state after deletion
      setLevels((ls) => {
        const newLs = ls.slice(0, levelIdx + 1);
        newLs[levelIdx].selected = "";
        return newLs;
      });
      onSelect(""); // Optionally clear selection
      toast.success("Deleted!");
    } catch (err) {
      toast.error("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  // Reset levels if parent resets (e.g., after submit)
  useEffect(() => {
    if (!value) {
      setLevels([{ parentId: null, options: levels[0]?.options || [], selected: "", adding: false }]);
    }
    // eslint-disable-next-line
  }, [value]);

  // Only show levels up to the last "used" one (i.e., if no parent selected for next, don't render)
  const visibleLevels = levels.filter(
    (lvl, idx) => idx === 0 || levels[idx - 1].selected || levels[idx - 1].adding
  );

  return (
    <div className="flex gap-2 flex-wrap">
      {visibleLevels.map((lvl, idx) =>
        lvl.adding ? (
          <div className="flex gap-1 mt-2" key={idx}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-2 py-1 border"
              style={{ borderColor: "#A1876F", color: "#A1876F" }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleAddNew(idx)}
              className="px-2 py-1 border bg-green-600 text-white"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setLevels((ls) => {
                  const newLs = ls.slice(0, idx + 1);
                  newLs[idx].adding = false;
                  return newLs;
                });
              }}
              className="px-2 py-1 border"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div key={idx} className="flex items-center gap-1">
            <select
              value={lvl.selected}
              onChange={(e) => handleSelect(idx, e.target.value)}
              className="px-2 py-1 border"
              style={{ borderColor: "#A1876F", color: "#A1876F" }}
            >
              <option value="">Select...</option>
              {(lvl.options || []).map((opt) => (
                <option key={opt._id} value={opt._id}>
                  {opt.name}
                </option>
              ))}
              <option value="add_new">+ Add New</option>
            </select>
            {/* Delete button: show only if something is selected */}
            {lvl.selected && (
              <button
                type="button"
                title="Delete this category and its children"
                className="px-2 py-1 border bg-red-500 text-white"
                style={{ fontWeight: 700 }}
                onClick={() => deleteCategory(idx)}
              >
                &#128465;
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}


// ========== MAIN ADD COMPONENT ==========
const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryNodeId, setCategoryNodeId] = useState("");
  const [unit, setUnit] = useState("piece"); // State for unit, default to 'piece'

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setPrice("");
    setBestseller(false);
    setCategoryNodeId("");
    setUnit("piece"); // Reset unit state
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!categoryNodeId) {
        toast.error("Please select a category.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("unit", unit); // Append unit to form data
      formData.append("category", categoryNodeId);
      formData.append("bestseller", bestseller);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Upload */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => {
            const image = eval("image" + i);
            const setImage = eval("setImage" + i);
            return (
              <div key={i}>
                <label htmlFor={`image${i}`}>
                  <img
                    className="w-20"
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt=""
                  />
                </label>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id={`image${i}`}
                  hidden
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* Product name */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      {/* Product description */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] min-h-[115px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          placeholder="Write content here"
          required
        />
      </div>

      {/* Combined Price and Unit Inputs */}
      <div className="flex gap-4">
        <div className="w-full">
          <p className="mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full max-w-[200px] px-3 py-2 border placeholder-[#A1876F]"
            style={{ borderColor: "#A1876F", color: "#A1876F" }}
            type="number"
            min="0"
            placeholder="₹100"
            required
          />
        </div>
        <div className="w-full">
          <p className="mb-2">Product Unit</p>
          <input
            onChange={(e) => setUnit(e.target.value)}
            value={unit}
            className="w-full max-w-[200px] px-3 py-2 border placeholder-[#A1876F]"
            style={{ borderColor: "#A1876F", color: "#A1876F" }}
            type="text"
            placeholder="e.g., piece, sq m, kg"
            required
          />
        </div>
      </div>

      {/* Dynamic Category Selector */}
      <div className="w-full">
        <p className="mb-2">Category</p>
        <DynamicCategorySelector onSelect={setCategoryNodeId} value={categoryNodeId} />
      </div>
      {/* Bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>
      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-28 py-3 mt-4 flex justify-center items-center gap-2"
        style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
      >
        {loading ? <ClipLoader size={20} color="#F0E1C6" /> : "ADD"}
      </button>
    </form>
  );
};

export default Add;