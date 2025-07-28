import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa"; // Import social media icons

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-40" alt="" />
          <p className="w-full md:w-2/3 text-[#A1876F]">
            Maa Tara Home delivers a wide range of superior plywood, hardware,
            and essential home solutions, all designed for lasting quality and
            aesthetic appeal. Your dream home truly starts with our trusted
            materials and committed expert support.{" "}
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5" style={{ color: "#40350A" }}>
            COMPANY
          </p>
          <ul className="flex flex-col gap-1 text-[#A1876F]">
            <li onClick={() => handleNavigate("/")} className="cursor-pointer">
              Home
            </li>
            <li
              onClick={() => handleNavigate("/about")}
              className="cursor-pointer"
            >
              About us
            </li>
            <li
              onClick={() => handleNavigate("/collection")}
              className="cursor-pointer"
            >
              Collection
            </li>
            <li>
              <a
                href="https://drive.google.com/your-privacy-policy-link"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5" style={{ color: "#40350A" }}>
            GET IN TOUCH
          </p>
          <ul className="flex flex-col gap-3"> {/* Increased gap for spacing including icons */}
            <li>
              <a href="tel:+916205330277" style={{ color: "#A1876F" }}>
                +91 6205330277
              </a>
            </li>
            <li>
              <a
                href="mailto:maatarahome1@gmail.com"
                style={{ color: "#A1876F" }}
              >
                maatarahome1@gmail.com
              </a>
            </li>
            {/* New: Social media icons */}
            <li className="flex gap-4 mt-2"> {/* Flex container for icons, added margin-top */}
              <a
                href="https://www.instagram.com/maatarahome?igsh=bHNmZ3N5MHQxY29q&utm_source=qr" // Replace with your actual Instagram link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "#A1876F", fontSize: "1.8rem" }} // Maintain color and size
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/share/19vbcwwM3p/?mibextid=wwXIfr" // Replace with your actual Facebook link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "#A1876F", fontSize: "1.8rem" }} // Maintain color and size
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com/@MaaTaraHome" // Replace with your actual YouTube link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{ color: "#A1876F", fontSize: "1.8rem" }} // Maintain color and size
              >
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr
          style={{ backgroundColor: "#40350A", height: "1px", border: "none" }}
        />
        <p className="py-5 text-sm text-center" style={{ color: "#40350A" }}>
          Copyright 2025 © Maa Tara Home - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;