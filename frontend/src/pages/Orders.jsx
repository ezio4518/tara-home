import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const loadOrderData = async (index) => {
    try {
      if (!token) {
        return null;
      }
      setLoadingIndex(index);
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            // Create a new object to avoid mutating the original item
            const itemWithOrderDetails = {
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            };
            allOrdersItem.push(itemWithOrderDetails);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      // handle error if needed
      console.error("Failed to load order data:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  useEffect(() => {
    if (token) {
        loadOrderData(null);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-[#40350A] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">
                  {item.name}
                </p>
                {/* --- UPDATED PRICE AND QUANTITY DISPLAY --- */}
                <div className="flex items-center gap-4 mt-1 text-base text-[#40350A]">
                  <p>
                    {currency}{item.price} / {item.unit || 'piece'}
                  </p>
                  <p className="text-sm text-[#A1876F]">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="mt-2 text-sm">
                  Date:{" "}
                  <span className="text-[#A1876F]">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1 text-sm">
                  Payment:{" "}
                  <span className="text-[#A1876F]">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={() => loadOrderData(index)}
                className="border px-4 py-2 text-sm font-medium rounded-sm w-28 h-10 flex items-center justify-center"
                disabled={loadingIndex === index}
              >
                {loadingIndex === index ? (
                  <ClipLoader color="#A1876F" size={20} />
                ) : (
                  "Track Order"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;