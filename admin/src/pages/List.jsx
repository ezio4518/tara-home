import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import EditProductPopup from "../components/EditProductPopup";
import ClipLoader from "react-spinners/ClipLoader";

const getCategoryIdString = (id) => {
  // Handles: string, { $oid: ... }, {_id: ...}
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object" && id.$oid) return id.$oid;
  if (typeof id === "object" && id._id) return id._id;
  return "";
};

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all categories and build a lookup map
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/all");
      if (response.data.success) {
        // Build a map: _id => { name, parent }
        const map = {};
        for (const cat of response.data.data) {
          map[getCategoryIdString(cat._id)] = {
            name: cat.name,
            parent: cat.parent,
          };
        }
        setCategories(map);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Helper: for a given category id, return "Gypsum → Channel → Angle" etc.
  const getCategoryPath = (id) => {
    const realId = getCategoryIdString(id);
    if (!realId || !categories[realId]) return "-";
    const path = [];
    let node = categories[realId];
    while (node) {
      path.unshift(node.name);
      node = node.parent ? categories[getCategoryIdString(node.parent)] : null;
    }
    return path.join(" → ");
  };

  // Fetch product list
  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchList();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader size={40} color="#40350A" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* --- 1. UPDATE HEADER --- */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_0.5fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b>Image</b>
            <b>Name</b>
            <b>Category Path</b>
            <b>Price / Unit</b>
            <b>Edit</b>
            <b className="text-center">Action</b>
          </div>
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr_2fr] md:grid-cols-[1fr_2fr_2fr_1fr_0.5fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img className="w-12 h-12 object-cover" src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>
                {getCategoryPath(item.category)}
              </p>
              {/* --- 2. UPDATE PRICE/UNIT DISPLAY --- */}
              <p>
                {currency}
                {item.price} / {item.unit || 'piece'}
              </p>
              <FiEdit2
                title="Edit"
                className="cursor-pointer text-[#40350A] hover:text-black"
                onClick={() => {
                  setEditProduct(item);
                  setShowEdit(true);
                }}
              />
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
            </div>
          ))}
        </div>
      )}
      {showEdit && (
        <EditProductPopup
          token={token}
          product={editProduct}
          onClose={() => setShowEdit(false)}
          onUpdate={fetchList}
        />
      )}
    </>
  );
};

export default List;