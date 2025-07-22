import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ClipLoader from 'react-spinners/ClipLoader'

// Helper function to safely normalize a MongoDB-style ID to a string
const getSafeId = (id) => {
    if (!id) return "";
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    if (id._id) return id._id;
    return String(id);
};


const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState({}) // {id: {name, parent}}

  // Fetch all categories once and build a lookup map
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/all");
      if (response.data.success) {
        const map = {};
        for (const cat of response.data.data) {
          // Use the safe ID helper to ensure keys are consistent strings
          map[getSafeId(cat._id)] = { name: cat.name, parent: cat.parent };
        }
        setCategories(map);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Given a category id, build its full path as a string by traversing up the parent chain
  const getCategoryPath = (id) => {
    let currentId = getSafeId(id);
    
    // Check if categories are loaded and the ID exists
    if (!currentId || !Object.keys(categories).length || !categories[currentId]) {
        return "Category not found";
    }

    const path = [];
    // Traverse up the tree until there is no parent
    while (currentId && categories[currentId]) {
        const node = categories[currentId];
        path.unshift(node.name);
        currentId = getSafeId(node.parent);
    }
    return path.join(" → ");
  };

  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllCategories();
    fetchAllOrders();
    // eslint-disable-next-line
  }, [token])

  return (
    <div style={{ color: '#40350A' }}>
      <h3 className="text-lg font-semibold mb-4">Order Page</h3>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader size={40} color="#40350A" />
        </div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm'
              style={{ border: '2px solid #A1876F', color: '#40350A' }}
            >
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                {/* --- UPDATED ITEM DISPLAY FORMAT --- */}
                <div className='flex flex-col gap-2'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <p className='font-semibold capitalize'>
                        {item.name} - <span className='font-bold'>Qty : {item.quantity} - Unit : {item.unit || 'piece'}</span>
                      </p>
                      <p className='text-xs text-gray-500 capitalize'>
                        {getCategoryPath(item.category)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className='mt-4 mb-2 font-medium'>
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold border'
                style={{ borderColor: '#A1876F', color: '#40350A' }}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders;