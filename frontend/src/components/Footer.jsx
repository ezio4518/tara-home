import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'

const Footer = () => {

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-40' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li onClick={() => handleNavigate('/')} className='cursor-pointer'>Home</li>
            <li onClick={() => handleNavigate('/about')} className='cursor-pointer'>About us</li>
            <li onClick={() => handleNavigate('/collection')} className='cursor-pointer'>Collection</li>
            <li>
              <a
                href='https://drive.google.com/your-privacy-policy-link'
                target='_blank'
                rel='noopener noreferrer'
                className='cursor-pointer'
              >
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
              <li><a href="tel:+916205330277">+91 6205330277</a></li>
              <li><a href="mailto:maataraplyandhardware@gmail.com">maataraplyandhardware@gmail.com</a></li>

            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025© Tara Home - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
