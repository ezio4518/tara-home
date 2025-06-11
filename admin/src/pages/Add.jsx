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
  const [company, setCompany] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCompany, setNewCompany] = useState("");
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
      const finalCompany = company === "add_new" ? newCompany.trim() : company;
      const finalSubCategory = subCategory === "add_new" ? newSubCategory.trim() : subCategory;

      await axios.post(`${backendUrl}/api/category/add`, {
        name: finalCategory,
        company: finalCompany,
        subCategory: finalSubCategory,
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", finalCategory);
      formData.append("company", finalCompany);
      formData.append("subCategory", finalSubCategory);
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
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setBestseller(false);
        setCategory("");
        setCompany("");
        setSubCategory("");
        setNewCategory("");
        setNewCompany("");
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

  const deleteCompany = async () => {
    if (!category || !company || company === "add_new") return toast.error("Select a company to delete.");
    try {
      const res = await axios.post(`${backendUrl}/api/category/delete-com`, {
        name: category,
        company: company,
      });
      toast.success(res.data.message);
      const updated = allCategories.map(cat => {
        if (cat.name === category) {
          return {
            ...cat,
            companies: cat.companies.filter(c => c.companyName !== company),
          };
        }
        return cat;
      });
      setAllCategories(updated);
      setCompany("");
      setSubCategory("");
    } catch (err) {
      toast.error("Failed to delete company.");
    }
  };

  const deleteSubCategory = async () => {
    if (!category || !company || !subCategory || subCategory === "add_new")
      return toast.error("Select a subcategory to delete.");
    try {
      const res = await axios.post(`${backendUrl}/api/category/delete-subcat`, {
        name: category,
        company: company,
        subCategory: subCategory,
      });
      toast.success(res.data.message);
      const updated = allCategories.map(cat => {
        if (cat.name === category) {
          return {
            ...cat,
            companies: cat.companies.map(com => {
              if (com.companyName === company) {
                return {
                  ...com,
                  subCategories: com.subCategories.filter(sc => sc.name !== subCategory),
                };
              }
              return com;
            }),
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
                  <img className="w-20" src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id={`image${i}`} hidden />
              </div>
            );
          })}
        </div>
      </div>

      {/* Product name and desc */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name}
          className="w-full max-w-[500px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          type="text" placeholder="Type here" required />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description}
          className="w-full max-w-[500px] px-3 py-2 border placeholder-[#A1876F]"
          style={{ borderColor: "#A1876F", color: "#A1876F" }}
          placeholder="Write content here" required />
      </div>

      {/* Category → Company → Subcategory */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* Category */}
        <div>
          <p className="mb-2">Category</p>
          <select value={category} onChange={(e) => {
            setCategory(e.target.value);
            setCompany("");
            setSubCategory("");
          }}
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

        {/* Company */}
        <div>
          <p className="mb-2">Company</p>
          <select value={company} onChange={(e) => {
            setCompany(e.target.value);
            setSubCategory("");
          }} className="w-full px-3 py-2 border" style={{ borderColor: "#A1876F", color: "#A1876F" }}>
            <option value="">Select Company</option>
            {category !== "add_new" &&
              allCategories.find(c => c.name === category)?.companies.map((com, i) => (
                <option key={i} value={com.companyName}>{com.companyName}</option>
              ))}
            <option value="add_new">+ Add New Company</option>
          </select>
          {company === "add_new" && (
            <input value={newCompany} onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Enter new company"
              className="mt-2 px-3 py-2 border w-full"
              style={{ borderColor: "#A1876F", color: "#A1876F" }} required />
          )}
        </div>

        {/* SubCategory */}
        <div>
          <p className="mb-2">Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border" style={{ borderColor: "#A1876F", color: "#A1876F" }}>
            <option value="">Select Subcategory</option>
            {category !== "add_new" && company !== "add_new" &&
              allCategories.find(c => c.name === category)
                ?.companies.find(co => co.companyName === company)
                ?.subCategories.map((sc, i) => (
                  <option key={i} value={sc.name}>{sc.name}</option>
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
      </div>

      {/* Bestseller + Delete buttons */}
      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="button" onClick={deleteCategory} className="px-4 py-2 bg-red-600 text-white rounded">Delete Category</button>
        <button type="button" onClick={deleteCompany} className="px-4 py-2 bg-red-600 text-white rounded">Delete Company</button>
        <button type="button" onClick={deleteSubCategory} className="px-4 py-2 bg-red-600 text-white rounded">Delete Subcategory</button>
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