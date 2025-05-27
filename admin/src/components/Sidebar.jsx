import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoIosList } from "react-icons/io";
import { PiPackage } from 'react-icons/pi';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 border border-[#A1876F] border-r-0 px-3 py-2 rounded-l' to="/add">
          <IoAddCircleOutline className='w-7 h-7' color="#40350A" />
          <p className='hidden md:block text-[#40350A]'>Add Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-[#A1876F] border-r-0 px-3 py-2 rounded-l' to="/list">
          <IoIosList className='w-7 h-7' color="#40350A" />
          <p className='hidden md:block text-[#40350A]'>List Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-[#A1876F] border-r-0 px-3 py-2 rounded-l' to="/orders">
          <PiPackage className='w-7 h-7' color="#40350A" />
          <p className='hidden md:block text-[#40350A]'>Orders</p>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;
