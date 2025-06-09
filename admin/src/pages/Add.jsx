// -*- coding: utf-8 -*-
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/category/get`);
        if (res.data.success) setAllCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalCategory = category === "add_new" ? newCategory.trim() : category;
      const finalSubCategory = subCategory === "add_new" ? newSubCategory.trim() : subCategory;

      await axios.post(`${backendUrl}/api/category/add`, {
        name: finalCategory,
        subCategory: finalSubCategory
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", finalCategory);
      formData.append("subCategory", finalSubCategory);
      formData.append("bestseller", bestseller);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setBestseller(false);
        setCategory("");
        setSubCategory("");
        setNewCategory("");
        setNewSubCategory("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!category || category === "add_new") return toast.error("Select a category to delete.");
    try {
      const res = await axios.post(`${backendUrl}/api/category/delete-cat`, { name: category });
      toast.success(res.data.message);
      setCategory("");
      setAllCategories(allCategories.filter(c => c.name !== category));
    } catch (err) {
      toast.error("Failed to delete category.");
    }
  };

  const deleteSubCategory = async () => {
    if (!category || !subCategory || subCategory === "add_new") return toast.error("Select a subcategory to delete.");
    try {
      const res = await axios.post(`${backendUrl}/api/category/delete-subcat`, {
        name: category,
        subCategory: subCategory
      });
      toast.success(res.data.message);
      const updated = allCategories.map(cat => {
        if (cat.name === category) {
          return {
            ...cat,
            subCategories: cat.subCategories.filter(sc => sc !== subCategory)
          };
        }
        return cat;
      });
      setAllCategories(updated);
      setSubCategory("");
    } catch (err) {
      toast.error("Failed to delete subcategory.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Upload Images */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => {
            const image = eval("image" + i);
            const setImage = eval("setImage" + i);
            return (
              <div key={i}>
                <label htmlFor={`image${i}`}>
                  <img className="w-20" src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id={`image${i}`} hidden />
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name}
          className="w-full max-w-[500px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          type="text" placeholder="Type here" required />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description}
          className="w-full max-w-[500px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          placeholder="Write content here" required />
      </div>

      {/* Category + SubCategory + Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}
            className="w-full px-3 py-2 border" style={{ borderColor: "#A1876F", color: "#A1876F" }}>
            <option value="">Select Category</option>
            {allCategories.map((cat, i) => (
              <option key={i} value={cat.name}>{cat.name}</option>
            ))}
            <option value="add_new">+ Add New Category</option>
          </select>
          {category === "add_new" && (
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="mt-2 px-3 py-2 border w-full"
              style={{ borderColor: "#A1876F", color: "#A1876F" }} required />
          )}
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border" style={{ borderColor: "#A1876F", color: "#A1876F" }}>
            <option value="">Select Subcategory</option>
            {category !== "add_new" &&
              allCategories.find((cat) => cat.name === category)?.subCategories.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            <option value="add_new">+ Add New Subcategory</option>
          </select>
          {subCategory === "add_new" && (
            <input value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}
              placeholder="Enter new subcategory"
              className="mt-2 px-3 py-2 border w-full"
              style={{ borderColor: "#A1876F", color: "#A1876F" }} required />
          )}
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price}
            className="w-full px-3 py-2 sm:w-[120px] border"
            style={{ borderColor: "#A1876F", color: "#A1876F" }}
            type="number" placeholder="25" required />
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* 🔴 Delete Buttons */}
      <div className="flex gap-4 mt-4">
        <button type="button" onClick={deleteCategory}
          className="px-4 py-2 bg-red-600 text-white rounded">Delete Category</button>
        <button type="button" onClick={deleteSubCategory}
          className="px-4 py-2 bg-red-500 text-white rounded">Delete Subcategory</button>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-28 py-3 mt-4 flex justify-center items-center gap-2"
        style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}>
        {loading ? <ClipLoader size={20} color="#F0E1C6" /> : "ADD"}
      </button>
    </form>
  );
};

export default Add;