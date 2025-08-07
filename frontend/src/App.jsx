import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import FloatingChat from './components/FloatingChat';
import FloatingFeedback from './components/FloatingFeedback';

const App = () => {
  useEffect(() => {
    const wakeAiBackend = async (retries = 3) => {
      const url = import.meta.env.VITE_AI_BACKEND_URL;

      for (let i = 0; i < retries; i++) {
        try {
          await fetch(url);
          console.log("✅ AI backend is awake");
          break;
        } catch (err) {
          console.warn(`⏳ Retry ${i + 1} failed to wake AI backend...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    };

    wakeAiBackend();
  }, []);

  return (
    // Use a React Fragment to wrap the app layout and the ToastContainer
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
        <SearchBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
        <FloatingFeedback />
        <FloatingChat />
        <Footer />
      </div>
      
      {/* Place ToastContainer outside the main layout div */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  );
};

export default App;