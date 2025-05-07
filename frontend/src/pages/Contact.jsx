import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
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
          <p style={{ color: "#A1876F" }}>
            <a
              href="tel:+916205330277"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              Tel: +91 6205330277
            </a>
            <br />
            <a
              href="mailto:maataraplyandhardware@gmail.com"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              Email: maataraplyandhardware@gmail.com
            </a>
          </p>

          <p className="font-semibold text-xl" style={{ color: "#40350A" }}>
            Careers at Forever
          </p>
          <p style={{ color: "#A1876F" }}>
            Learn more about our teams and job openings.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
