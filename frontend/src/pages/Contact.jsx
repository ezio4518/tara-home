import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { FaInstagram, FaFacebook, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const googleMapsUrl = "https://maps.app.goo.gl/KuuwxvpmU2KqKSdd7"; 

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl" style={{ color: "#40350A" }}>
            Our Store
          </p>
          <p style={{ color: "#A1876F" }}>
            Near Jora Pool, Kanke Road <br /> Ranchi, Jharkhand
          </p>

          {/* Updated: Google Maps Link with social media-like style */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#A1876F", // Matched social media link color
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              // Removed fontWeight: "bold" to match social media text style
            }}
          >
            <FaMapMarkerAlt style={{ fontSize: "1.8rem" }} /> {/* Matched social media icon size */}
            Find Us on Map
          </a>

          <p style={{ color: "#A1876F" }}>
            <a
              href="tel:+916205330277"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              Tel: +91 6205330277 , 
            </a>
            <a
              href="tel:+919470562450"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              +91 9470562450
            </a>
            <br />
            <a
              href="mailto:maatarahome1@gmail.com"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              Email: maatarahome1@gmail.com
            </a>
          </p>

          <p className="font-semibold text-xl" style={{ color: "#40350A" }}>
            Our presence on Social Media
          </p>
          <div className="flex flex-col gap-2">
            <a 
              href="https://www.instagram.com/maatarahome?igsh=bHNmZ3N5MHQxY29q&utm_source=qr" // Replace with your actual Instagram link
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#A1876F", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaInstagram style={{ fontSize: "1.8rem" }} />
              maatarahome
            </a>
            <a 
              href="https://www.facebook.com/share/19vbcwwM3p/?mibextid=wwXIfr" // Replace with your actual Facebook link
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#A1876F", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaFacebook style={{ fontSize: "1.8rem" }} />
              Maa Tara Home 
            </a>
            <a 
              href="https://www.youtube.com/@MaaTaraHome" // Replace with your actual YouTube link
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#A1876F", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaYoutube style={{ fontSize: "1.8rem" }} />
              MaaTaraHome
            </a>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;