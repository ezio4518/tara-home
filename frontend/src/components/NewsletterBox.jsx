import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

const NewsletterBox = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Show toast
    toast.success("You are subscribed to our email services");

    // Clear input
    setEmail("");
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium" style={{ color: "#40350A" }}>
        Subscribe now & Save Big!
      </p>

      <p className="text-[#A1876F] mt-3">
        Join our newsletter for exclusive discounts, the latest product arrivals, and expert tips on home improvement.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 pl-3"
        style={{ borderColor: "#5B3720", borderWidth: "2px" }}
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ color: "#A1876F" }}
        />
        <button
          type="submit"
          className="text-xs px-10 py-4"
          style={{
            backgroundColor: "#5B3720",
            color: "#F0E1C6",
            cursor: "pointer",
          }}
        >
          SUBSCRIBE
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer/>
    </div>
  );
};

export default NewsletterBox;


// hidden sm:block