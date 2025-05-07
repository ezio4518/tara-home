import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p style={{ color: "#A1876F" }}>
        {text1}{" "}
        <span style={{ color: "#40350A", fontWeight: "500" }}>{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#40350A]"></p>
    </div>
  );
};

export default Title;
