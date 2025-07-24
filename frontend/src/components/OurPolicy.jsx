import React from "react";
import { RiCustomerServiceFill } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";
import { TbExchange } from "react-icons/tb";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-[#40350A]">
      <div>
        <TbExchange className="w-12 h-12 m-auto mb-5" color="#40350A" />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-[#A1876F]">We offer hassle free exchange policy</p>
      </div>

      <div>
        <SiTicktick className="w-12 h-12 m-auto mb-5" color="#40350A" />
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="text-[#A1876F]">We provide 7 days free return policy</p>
      </div>

      <div>
        <RiCustomerServiceFill className="w-12 h-12 m-auto mb-5" color="#40350A" />
        <p className="font-semibold">Best customer support</p>
        <p className="text-[#A1876F]">We provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
