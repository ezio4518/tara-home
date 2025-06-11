import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const EditProductPopup = ({ product, token, onClose, onUpdate }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [company, setCompany] = useState(product.company);
  const [subCategory, setSubCategory] = useState(product.subCategory);
  const [newCategory, setNewCategory] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(product.bestseller);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

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

  const handleSubmit = async (e) => {
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
      formData.append('productId', product._id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', finalCategory);
      formData.append('company', finalCompany);
      formData.append('subCategory', finalSubCategory);
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Images */}
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

          {/* Text inputs */}
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="border px-3 py-2" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border px-3 py-2" />

          {/* Selects */}
          <div className="flex gap-4 flex-wrap">
            {/* Category */}
            <div className="flex flex-col">
              <select value={category} onChange={e => {
                setCategory(e.target.value);
                setCompany("");
                setSubCategory("");
              }} className="border px-3 py-2">
                <option value="">Select Category</option>
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat.name}>{cat.name}</option>
                ))}
                <option value="add_new">+ Add New Category</option>
              </select>
              {category === "add_new" && (
                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter new category" className="mt-1 px-3 py-2 border" required />
              )}
            </div>

            {/* Company */}
            <div className="flex flex-col">
              <select value={company} onChange={e => {
                setCompany(e.target.value);
                setSubCategory("");
              }} className="border px-3 py-2">
                <option value="">Select Company</option>
                {category !== "add_new" &&
                  allCategories.find(c => c.name === category)?.companies.map((com, i) => (
                    <option key={i} value={com.companyName}>{com.companyName}</option>
                  ))}
                <option value="add_new">+ Add New Company</option>
              </select>
              {company === "add_new" && (
                <input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Enter new company" className="mt-1 px-3 py-2 border" required />
              )}
            </div>

            {/* SubCategory */}
            <div className="flex flex-col">
              <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="border px-3 py-2">
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
                <input value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} placeholder="Enter new subcategory" className="mt-1 px-3 py-2 border" required />
              )}
            </div>

            {/* Price */}
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="border px-3 py-2 w-24" />
          </div>

          <label className="flex gap-2">
            <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
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