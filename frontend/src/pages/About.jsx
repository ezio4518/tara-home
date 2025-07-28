import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div
          className="flex flex-col justify-center gap-6 md:w-2/4"
          style={{ color: "#A1876F" }}
        >
          <p>
            Maa Tara Home is dedicated to supplying high-quality plywood,
            modular hardware, gypsum accessories, and comprehensive home
            improvement solutions in Patna. Our focus is on empowering every
            home and project with unparalleled strength, style, and durability,
            serving both homeowners and professional contractors.
          </p>
          <p>
            We pride ourselves on meticulously sourcing our products from
            trusted manufacturers, guaranteeing superior quality and consistent
            performance across our entire range. From the foundational elements
            of plywood and boards (including Blockboard, MDF, HDMR, and Particle
            Board) to essential hardware, flush doors, decorative laminates
            (like Sunmica and Acrylic), and gypsum products, we ensure reliable
            materials for every building and renovation need.
          </p>
          <b style={{ color: "#40350A" }}>Our Mission</b>
          <p>
            Our mission at Maa Tara Home is to be the reliable cornerstone of
            your construction and interior projects. We are committed to
            providing not just exceptional products, but also expert guidance
            and a seamless experience. We strive to empower our customers to
            build with confidence, creating lasting spaces of quality and
            beauty.
          </p>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-[#40350A] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b style={{ color: "#40350A" }}>Quality Assurance:</b>
          <p style={{ color: "#A1876F" }}>
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="border border-[#40350A] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b style={{ color: "#40350A" }}>Convenience:</b>
          <p style={{ color: "#A1876F" }}>
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border border-[#40350A] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b style={{ color: "#40350A" }}>Exceptional Customer Service:</b>
          <p style={{ color: "#A1876F" }}>
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
