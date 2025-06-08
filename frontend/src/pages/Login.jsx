import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader"; // Spinner

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl, setCoin } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader

    try {
      if (currentState === "Sign Up") {
        if (!email && !phone) {
          toast.error("Please provide at least Email or Phone number.");
          setLoading(false);
          return;
        }
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          phone,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        if (!identifier) {
          toast.error("Please enter your Email or Phone number.");
          setLoading(false);
          return;
        }
        const isEmail = identifier.includes("@");
        const loginPayload = {
          password,
          ...(isEmail ? { email: identifier } : { phone: identifier }),
        };
        const response = await axios.post(backendUrl + "/api/user/login", loginPayload);
        if (response.data.success) {
          setToken(response.data.token);
          setCoin(response.data.coin);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-[#40350A]"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-[#40350A]" />
      </div>

      {currentState === "Sign Up" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-[#A1876F] text-[#A1876F]"
          placeholder="Full Name"
          required
        />
      )}

      {currentState === "Login" && (
        <input
          onChange={(e) => setIdentifier(e.target.value)}
          value={identifier}
          type="text"
          className="w-full px-3 py-2 border border-[#A1876F] text-[#A1876F]"
          placeholder="Email or Phone"
          required
        />
      )}

      {currentState === "Sign Up" && (
        <>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-3 py-2 border border-[#A1876F] text-[#A1876F]"
            placeholder="Email (optional)"
          />
          <input
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            type="tel"
            className="w-full px-3 py-2 border border-[#A1876F] text-[#A1876F]"
            placeholder="Phone (optional)"
          />
        </>
      )}

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-[#A1876F] text-[#A1876F]"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px] text-[#40350A]">
        {currentState === "Login" && <p className="cursor-pointer">Forgot your password?</p>}
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState("Login")} className="cursor-pointer">
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#40350A] text-[#F0E1C6] font-light px-8 py-2 mt-4 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
      >
        {loading ? (
          <>
            <ClipLoader color="#F0E1C6" size={20} />
          </>
        ) : (
          currentState === "Login" ? "Sign In" : "Sign Up"
        )}
      </button>
    </form>
  );
};

export default Login;