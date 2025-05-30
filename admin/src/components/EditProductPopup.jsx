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
  const [subCategory, setSubCategory] = useState(product.subCategory);
  const [bestseller, setBestseller] = useState(product.bestseller);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product._id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/update`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Product updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error(response.data.message);
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
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => {
              const img = product.image[i - 1];
              const state = eval(`image${i}`);
              const setState = eval(`setImage${i}`);
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

          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="border px-3 py-2" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border px-3 py-2" />
          
          <div className="flex gap-4">
            <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="border px-3 py-2">
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
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