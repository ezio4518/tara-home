// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { backendUrl, currency } from '../App'
// import { toast } from 'react-toastify'
// import { assets } from '../assets/assets'
// import ClipLoader from 'react-spinners/ClipLoader'

// const Orders = ({ token }) => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(false)

//   const fetchAllOrders = async () => {
//     if (!token) return null;
//     setLoading(true)
//     try {
//       const response = await axios.post(
//         backendUrl + '/api/order/list',
//         {},
//         { headers: { token } }
//       )
//       if (response.data.success) {
//         setOrders(response.data.orders.reverse())
//       } else {
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//     setLoading(false)
//   }

//   const statusHandler = async (event, orderId) => {
//     try {
//       const response = await axios.post(
//         backendUrl + '/api/order/status',
//         { orderId, status: event.target.value },
//         { headers: { token } }
//       )
//       if (response.data.success) {
//         await fetchAllOrders()
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     fetchAllOrders()
//   }, [token])

//   return (
//     <div style={{ color: '#40350A' }}>
//       <h3 className="text-lg font-semibold mb-4">Order Page</h3>

//       {loading ? (
//         <div className="flex justify-center items-center h-32">
//           <ClipLoader size={40} color="#40350A" />
//         </div>
//       ) : (
//         <div>
//           {
//             orders.map((order, index) => (
//               <div
//                 key={index}
//                 className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm'
//                 style={{ border: '2px solid #A1876F', color: '#40350A' }}
//               >
//                 <img className='w-12' src={assets.parcel_icon} alt="" />
//                 <div>
//                   <div>
//                     {order.items.map((item, index) => (
//                       <p className='py-0.5' key={index}>
//                         {item.name} | {item.category} | {item.company} | {item.subCategory} x {item.quantity}{index !== order.items.length - 1 && ','}
//                       </p>
//                     ))}
//                   </div>
//                   <p className='mt-3 mb-2 font-medium'>
//                     {order.address.firstName + " " + order.address.lastName}
//                   </p>
//                   <div>
//                     <p>{order.address.street + ","}</p>
//                     <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
//                   </div>
//                   <p>{order.address.phone}</p>
//                 </div>
//                 <div>
//                   <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
//                   <p className='mt-3'>Method : {order.paymentMethod}</p>
//                   <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
//                   <p>Date : {new Date(order.date).toLocaleDateString()}</p>
//                 </div>
//                 <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
//                 <select
//                   onChange={(event) => statusHandler(event, order._id)}
//                   value={order.status}
//                   className='p-2 font-semibold border'
//                   style={{ borderColor: '#A1876F', color: '#40350A' }}
//                 >
//                   <option value="Order Placed">Order Placed</option>
//                   <option value="Packing">Packing</option>
//                   <option value="Shipped">Shipped</option>
//                   <option value="Out for delivery">Out for delivery</option>
//                   <option value="Delivered">Delivered</option>
//                 </select>
//               </div>
//             ))
//           }
//         </div>
//       )}
//     </div>
//   )
// }

// export default Orders

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ClipLoader from 'react-spinners/ClipLoader'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState({}) // {id: {name, parent}}

  // Fetch all categories once
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/all");
      if (response.data.success) {
        const map = {};
        for (const cat of response.data.data) {
          map[cat._id] = { name: cat.name, parent: cat.parent };
        }
        setCategories(map);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Given a category id, build its full path as a string
  const getCategoryPath = (id) => {
    if (!id || !categories[id]) return "-";
    const path = [];
    let node = categories[id];
    let currentId = id;
    while (node) {
      path.unshift(node.name);
      node = node.parent ? categories[node.parent] : null;
      currentId = node?.parent;
    }
    return path.join(" → ");
  };

  const fetchAllOrders = async () => {
    if (!token) return null;
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
                <div>
                  {order.items.map((item, idx) => (
                    <p className='py-0.5' key={idx}>
                      {item.name} 
                      {" | "}
                      <span style={{ fontWeight: 500 }}>
                        {getCategoryPath(typeof item.category === "object" && item.category.$oid ? item.category.$oid : item.category)}
                      </span>
                      {item.company ? ` | ${item.company}` : ""}
                      {item.subCategory ? ` | ${item.subCategory}` : ""}
                      {" x "}
                      {item.quantity}
                      {idx !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className='mt-3 mb-2 font-medium'>
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