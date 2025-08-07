// import React, { useContext, useEffect, useState } from "react";
// import Title from "../components/Title";
// import CartTotal from "../components/CartTotal";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import ClipLoader from "react-spinners/ClipLoader";

// const PlaceOrder = () => {
//   const [method, setMethod] = useState("cod");
//   const [formLoading, setFormLoading] = useState(false);
//   const {
//     navigate,
//     backendUrl,
//     token,
//     cartItems,
//     setCartItems,
//     getCartAmount,
//     delivery_fee,
//     products,
//     coin,
//     getUserInfo,
//   } = useContext(ShopContext);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   // Fetch and pre-fill user's delivery information
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       if (token) {
//         setFormLoading(true);
//         try {
//           const response = await axios.post(
//             backendUrl + "/api/user/userinfo",
//             {},
//             { headers: { token } }
//           );
//           if (response.data.success) {
//             const { name = "", email = "", phone = "", address = {} } =
//               response.data;
//             const nameParts = name.split(" ");
//             const firstName = nameParts[0] || "";
//             const lastName = nameParts.slice(1).join(" ") || "";

//             setFormData({
//               firstName: firstName,
//               lastName: lastName,
//               email: email || "",
//               phone: phone || "",
//               street: address.street || "",
//               city: address.city || "",
//               state: address.state || "",
//               zipcode: address.zipcode || "",
//               country: address.country || "",
//             });
//           }
//         } catch (error) {
//           toast.error("Could not load your saved information.");
//         } finally {
//           setFormLoading(false);
//         }
//       }
//     };
//     fetchUserInfo();
//   }, [token, backendUrl]);

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setFormData((data) => ({ ...data, [name]: value }));
//   };

//   const initPay = (order) => {
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Order Payment",
//       description: "Order Payment",
//       order_id: order.id,
//       receipt: order.receipt,
//       handler: async (response) => {
//         try {
//           const { data } = await axios.post(
//             backendUrl + "/api/order/verifyRazorpay",
//             response,
//             { headers: { token } }
//           );
//           if (data.success) {
//             navigate("/orders");
//             setCartItems({});
//           }
//         } catch (error)
//  {
//           toast.error(error.message);
//         }
//       },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     try {
//       let orderItems = [];
//       for (const itemId in cartItems) {
//         if (cartItems[itemId] > 0) {
//           const itemInfo = products.find((product) => product._id === itemId);
//           if (itemInfo) {
//             orderItems.push({
//               _id: itemInfo._id,
//               name: itemInfo.name,
//               image: itemInfo.image,
//               price: itemInfo.price,
//               quantity: cartItems[itemId],
//               category: itemInfo.category,
//               unit: itemInfo.unit,
//             });
//           }
//         }
//       }

//       const subtotal = getCartAmount();
//       const discount = Math.min(subtotal + delivery_fee, coin);

//       let orderData = {
//         address: formData,
//         items: orderItems,
//         amount: subtotal + delivery_fee - discount,
//       };


//       switch (method) {
//         case "cod":
//           const response = await axios.post(
//             backendUrl + "/api/order/place",
//             orderData,
//             { headers: { token } }
//           );
//           if (response.data.success) {
//             setCartItems({});
//             await getUserInfo(token);
//             navigate("/orders");
//             toast.success("Order placed successfully!");
//           } else {
//             toast.error(response.data.message);
//           }
//           break;

//         case "stripe":
//           const responseStripe = await axios.post(
//             backendUrl + "/api/order/stripe",
//             orderData,
//             { headers: { token } }
//           );
//           if (responseStripe.data.success) {
//             const { session_url } = responseStripe.data;
//             window.location.replace(session_url);
//           } else {
//             toast.error(responseStripe.data.message);
//           }
//           break;

//         case "razorpay":
//           const responseRazorpay = await axios.post(
//             backendUrl + "/api/order/razorpay",
//             orderData,
//             { headers: { token } }
//           );
//           if (responseRazorpay.data.success) {
//             initPay(responseRazorpay.data.order);
//           }
//           break;

//         default:
//           break;
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 pt-5 sm:pt-14 min-h-[80vh] border-t"
//     >
//       {/* ------------- Left Side: Delivery Information ---------------- */}
//       <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
//         <div className="text-xl sm:text-2xl my-3">
//           <Title text1={"DELIVERY"} text2={"INFORMATION"} />
//         </div>
//         {formLoading ? (
//           <div className="flex justify-center items-center h-48">
//             <ClipLoader color="#A1876F" size={40} />
//           </div>
//         ) : (
//           <>
//             <div className="flex gap-3">
//               <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="First name" />
//               <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Last name" />
//             </div>
//             <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="email" placeholder="Email address" />
//             <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Street" />
//             <div className="flex gap-3">
//               <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="City" />
//               <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="State" />
//             </div>
//             <div className="flex gap-3">
//               <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Zipcode" />
//               <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Country" />
//             </div>
//             <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Phone" />
//           </>
//         )}
//       </div>

//       {/* ------------- Right Side: Cart & Payment ------------------ */}
//       <div className="mt-8">
//         <div className="mt-8">
//           <CartTotal />
//         </div>

//         <div className="mt-12">
//           <Title text1={"PAYMENT"} text2={"METHOD"} />
//           {/* --- REMOVED flex-wrap and explicitly set flex-row for small screens --- */}
//           <div className="flex flex-col sm:flex-row gap-3 mt-4">
//             <div
//               onClick={() => setMethod("stripe")}
//               className={`flex items-center gap-3 rounded p-2 px-3 cursor-pointer transition-all duration-200 ${
//                 method === "stripe"
//                   ? "bg-[#F9F4ED] border-2 border-[#40350A] shadow-sm scale-[1.01]"
//                   : "border border-[#40350A]"
//               }`}
//             >
//               <p className={`min-w-3.5 h-3.5 border border-[#40350A] rounded-full ${
//                   method === "stripe" ? "bg-[#E5D3B2]" : ""
//                 }`}
//               ></p>
//               <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
//             </div>

//             <div
//               onClick={() => setMethod("razorpay")}
//               className={`flex items-center gap-3 rounded p-2 px-3 cursor-pointer transition-all duration-200 ${
//                 method === "razorpay"
//                   ? "bg-[#F9F4ED] border-2 border-[#40350A] shadow-sm scale-[1.01]"
//                   : "border border-[#40350A]"
//               }`}
//             >
//               <p className={`min-w-3.5 h-3.5 border border-[#40350A] rounded-full ${
//                   method === "razorpay" ? "bg-[#E5D3B2]" : ""
//                 }`}
//               ></p>
//               <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
//             </div>

//             <div
//               onClick={() => setMethod("cod")}
//               className={`flex items-center gap-3 rounded p-2 px-3 cursor-pointer transition-all duration-200 ${
//                 method === "cod"
//                   ? "bg-[#F9F4ED] border-2 border-[#40350A] shadow-sm scale-[1.01]"
//                   : "border border-[#40350A]"
//               }`}
//             >
//               <p className={`min-w-3.5 h-3.5 border border-[#40350A] rounded-full ${
//                   method === "cod" ? "bg-[#E5D3B2]" : ""
//                 }`}
//               >
//               </p>
//               <p className="text-gray-600 text-sm font-medium mx-4">
//                 CASH ON DELIVERY
//               </p>
//             </div>
//           </div>

//           <div className="w-full text-end mt-8">
//             <button
//               type="submit"
//               className="bg-[#40350A] text-[#F0E1C6] px-16 py-3 text-sm cursor-pointer"
//             >
//               PLACE ORDER
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;

import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [formLoading, setFormLoading] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    coin,
    getUserInfo,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Fetch and pre-fill user's delivery information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        setFormLoading(true);
        try {
          const response = await axios.post(
            backendUrl + "/api/user/userinfo",
            {},
            { headers: { token } }
          );
          if (response.data.success) {
            const { name = "", email = "", phone = "", address = {} } =
              response.data;
            const nameParts = name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            setFormData({
              firstName: firstName,
              lastName: lastName,
              email: email || "",
              phone: phone || "",
              street: address.street || "",
              city: address.city || "",
              state: address.state || "",
              zipcode: address.zipcode || "",
              country: address.country || "",
            });
          }
        } catch (error) {
          toast.error("Could not load your saved information.");
        } finally {
          setFormLoading(false);
        }
      }
    };
    fetchUserInfo();
  }, [token, backendUrl]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          const itemInfo = products.find((product) => product._id === itemId);
          if (itemInfo) {
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              image: itemInfo.image,
              price: itemInfo.price,
              quantity: cartItems[itemId],
              category: itemInfo.category,
              unit: itemInfo.unit,
            });
          }
        }
      }

      const subtotal = getCartAmount();
      const discount = Math.min(subtotal + delivery_fee, coin);

      let orderData = {
        address: formData,
        items: orderItems,
        amount: subtotal + delivery_fee - discount,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            await getUserInfo(token);
            navigate("/orders");
            toast.success("Order placed successfully!");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "razorpay":
          // This case will not be reached due to the UI change, but is kept for future use.
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- NEW FUNCTION [START] ---
  // Shows a toast message for the disabled Razorpay option.
  const handleRazorpayClick = () => {
    toast.info("Razorpay payment option is coming soon!");
  };
  // --- NEW FUNCTION [END] ---

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- Left Side: Delivery Information ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        {formLoading ? (
          <div className="flex justify-center items-center h-48">
            <ClipLoader color="#A1876F" size={40} />
          </div>
        ) : (
          <>
            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="First name" />
              <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Last name" />
            </div>
            <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="email" placeholder="Email address" />
            <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Street" />
            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="City" />
              <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="State" />
            </div>
            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Zipcode" />
              <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Country" />
            </div>
            <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-[#A1876F] text-[#A1876F] rounded py-1.5 px-3.5 w-full placeholder:text-[#ccc]" type="text" placeholder="Phone" />
          </>
        )}
      </div>

      {/* ------------- Right Side: Cart & Payment ------------------ */}
      <div className="mt-8">
        <div className="mt-8">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-3 rounded p-2 px-3 cursor-pointer transition-all duration-200 ${
                method === "stripe"
                  ? "bg-[#F9F4ED] border-2 border-[#40350A] shadow-sm scale-[1.01]"
                  : "border border-[#40350A]"
              }`}
            >
              <p className={`min-w-3.5 h-3.5 border border-[#40350A] rounded-full ${
                  method === "stripe" ? "bg-[#E5D3B2]" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            {/* --- MODIFIED CODE [START] --- */}
            <div
              onClick={handleRazorpayClick}
              className="flex items-center gap-3 rounded p-2 px-3 cursor-not-allowed opacity-50 transition-all duration-200 border border-[#40350A]"
            >
              <p className="min-w-3.5 h-3.5 border border-[#40350A] rounded-full"></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay (Coming Soon)" />
            </div>
            {/* --- MODIFIED CODE [END] --- */}

            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-3 rounded p-2 px-3 cursor-pointer transition-all duration-200 ${
                method === "cod"
                  ? "bg-[#F9F4ED] border-2 border-[#40350A] shadow-sm scale-[1.01]"
                  : "border border-[#40350A]"
              }`}
            >
              <p className={`min-w-3.5 h-3.5 border border-[#40350A] rounded-full ${
                  method === "cod" ? "bg-[#E5D3B2]" : ""
                }`}
              >
              </p>
              <p className="text-gray-600 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-[#40350A] text-[#F0E1C6] px-16 py-3 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;