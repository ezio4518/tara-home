import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

// DYNAMIC CATEGORY SELECTOR (No changes needed in this helper component)
function DynamicCategorySelector({ onSelect, value }) {
  const [levels, setLevels] = useState([
    { parentId: null, options: [], selected: "", adding: false }
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchOptions(null, 0);
    // eslint-disable-next-line
  }, []);

  const fetchOptions = async (parentId, level) => {
    const url = parentId
      ? `${backendUrl}/api/category/children/${parentId}`
      : `${backendUrl}/api/category/roots`;
    const res = await axios.get(url);
    setLevels((ls) => {
      const newLs = ls.slice(0, level + 1);
      newLs[level] = { ...newLs[level], options: res.data.data, selected: "", adding: false };
      if (newLs.length === level + 1) {
        newLs.push({ parentId: null, options: [], selected: "", adding: false });
      }
      return newLs;
    });
  };

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
        newLs.length = levelIdx + 2;
        newLs[levelIdx + 1] = { parentId: nodeId, options: [], selected: "", adding: false };
        return newLs;
      });
      fetchOptions(nodeId, levelIdx + 1);
      onSelect(nodeId);
    }
  };

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
        const newLs = ls.slice(0, levelIdx + 2);
        newLs[levelIdx].options = [...(newLs[levelIdx].options || []), newNode];
        newLs[levelIdx].selected = newNode._id;
        newLs[levelIdx].adding = false;
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

  const deleteCategory = async (levelIdx) => {
    const nodeId = levels[levelIdx].selected;
    if (!nodeId) return;
    if (!window.confirm("Delete this category and ALL its subcategories?")) return;
    try {
      await axios.delete(`${backendUrl}/api/category/delete/${nodeId}`);
      if (levelIdx === 0) {
        fetchOptions(null, 0);
      } else {
        const parentId = levels[levelIdx - 1]?.selected || null;
        fetchOptions(parentId, levelIdx);
      }
      setLevels((ls) => {
        const newLs = ls.slice(0, levelIdx + 1);
        newLs[levelIdx].selected = "";
        return newLs;
      });
      onSelect("");
      toast.success("Deleted!");
    } catch (err) {
      toast.error("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  };

  // Sync UI with initial value (for editing existing)
  useEffect(() => {
    if (value) {
      (async () => {
        let valueId = typeof value === "object" ? (value?._id || "") : value;
        if (!valueId) return;
        try {
            let res = await axios.get(`${backendUrl}/api/category/node/${valueId}`);
            let node = res.data.data;
            if (!node) return; // Node might have been deleted
            let pathArr = (node.path || []).concat(node._id);
            let curParent = null;
            let newLevels = [];
            for (let i = 0; i < pathArr.length; ++i) {
                const optsRes = await axios.get(
                curParent
                    ? `${backendUrl}/api/category/children/${curParent}`
                    : `${backendUrl}/api/category/roots`
                );
                newLevels.push({
                parentId: curParent,
                options: optsRes.data.data,
                selected: pathArr[i],
                adding: false,
                });
                curParent = pathArr[i];
            }
            // Always push empty next level
            newLevels.push({ parentId: curParent, options: [], selected: "", adding: false });
            setLevels(newLevels);
        } catch (error) {
            console.error("Failed to sync category path", error);
        }
      })();
    }
  // eslint-disable-next-line
  }, [value]);

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
              onChange={e => setNewCategoryName(e.target.value)}
              className="px-2 py-1 border"
              style={{ borderColor: "#A1876F", color: "#A1876F" }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleAddNew(idx)}
              className="px-2 py-1 border bg-green-600 text-white"
            >Add</button>
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
            >Cancel</button>
          </div>
        ) : (
          <div key={idx} className="flex items-center gap-1">
            <select
              value={lvl.selected}
              onChange={e => handleSelect(idx, e.target.value)}
              className="px-2 py-1 border"
              style={{ borderColor: "#A1876F", color: "#A1876F" }}
            >
              <option value="">Select...</option>
              {(lvl.options || []).map(opt => (
                <option key={opt._id} value={opt._id}>{opt.name}</option>
              ))}
              <option value="add_new">+ Add New</option>
            </select>
            {lvl.selected && (
              <button
                type="button"
                title="Delete this category and its children"
                className="px-2 py-1 border bg-red-500 text-white"
                style={{ fontWeight: 700 }}
                onClick={() => deleteCategory(idx)}
              >&#128465;</button>
            )}
          </div>
        )
      )}
    </div>
  );
};

const EditProductPopup = ({ product, token, onClose, onUpdate }) => {
  // Helper to safely get category ID string
  const getCategoryId = (cat) =>
    typeof cat === "object" && cat !== null ? cat._id || "" : cat || "";

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [categoryNodeId, setCategoryNodeId] = useState(getCategoryId(product.category));
  const [bestseller, setBestseller] = useState(product.bestseller);
  const [loading, setLoading] = useState(false);

  // --- 1. ADD STATE FOR UNIT ---
  const [unit, setUnit] = useState(product.unit || 'piece'); // Initialize with product's unit or fallback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!categoryNodeId) {
        toast.error("Please select a category.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('productId', product._id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      // --- 2. APPEND UNIT TO FORMDATA ---
      formData.append('unit', unit);
      formData.append('category', categoryNodeId);
      formData.append('bestseller', bestseller);
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      const res = await axios.post(`${backendUrl}/api/product/update`, formData, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success("Product updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute right-4 top-2 text-xl">✕</button>
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Images */}
          <div>
            <p className="mb-1 font-medium">Images</p>
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => {
                    const img = product.image[i - 1];
                    const state = eval("image" + i);
                    const setState = eval("setImage" + i);
                    return (
                    <div key={i}>
                        <label htmlFor={`edit-img-${i}`}>
                        <img
                            className="w-20 h-20 object-cover border"
                            src={state ? URL.createObjectURL(state) : img || assets.upload_area}
                            alt=""
                        />
                        </label>
                        <input
                        type="file"
                        id={`edit-img-${i}`}
                        hidden
                        onChange={(e) => setState(e.target.files[0])}
                        />
                    </div>
                    );
                })}
            </div>
          </div>

          {/* Text inputs */}
          <div>
             <p className="mb-1 font-medium">Product Name</p>
             <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="w-full border px-3 py-2" />
          </div>
          <div>
            <p className="mb-1 font-medium">Description</p>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2" rows={3}/>
          </div>
          
          {/* --- 3. COMBINED PRICE AND UNIT INPUTS --- */}
          <div className="flex gap-4">
            <div className='flex-1'>
                <p className="mb-1 font-medium">Price</p>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-full border px-3 py-2" />
            </div>
            <div className='flex-1'>
                <p className="mb-1 font-medium">Unit</p>
                <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g.,piece, sq m" className="w-full border px-3 py-2" />
            </div>
          </div>
          
          {/* Category selector */}
          <div>
            <p className="mb-1 font-medium">Category</p>
            <DynamicCategorySelector onSelect={setCategoryNodeId} value={categoryNodeId} />
          </div>

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} className='w-4 h-4' />
            Bestseller
          </label>

          <button type="submit" disabled={loading} className="bg-[#40350A] text-white py-2 rounded">
            {loading ? <ClipLoader size={20} color="white" /> : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPopup;