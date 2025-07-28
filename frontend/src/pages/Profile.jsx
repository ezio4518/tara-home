import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaUserCircle } from "react-icons/fa"; // Import the icon

const Profile = () => {
    const { token, setToken, backendUrl, coin, navigate } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // State with a single 'name' field
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: ""
        }
    });

    const [originalUserData, setOriginalUserData] = useState(null);

    // Fetch user info on component load
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await axios.post(backendUrl + '/api/user/userinfo', {}, { headers: { token } });
                    if (response.data.success) {
                        const { name = "", email = "", phone = "", address = {} } = response.data;

                        const fetchedData = {
                            name,
                            email,
                            phone,
                            address: address || { street: "", city: "", state: "", zipcode: "", country: "" }
                        };
                        setUserData(fetchedData);
                        setOriginalUserData(fetchedData); 
                    }
                } catch (error) {
                    toast.error("Failed to fetch user data.");
                }
            }
        };
        fetchUserData();
    }, [token, backendUrl]);
    
    // Handler for form input changes
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (['street', 'city', 'state', 'zipcode', 'country'].includes(name)) {
            setUserData(prevData => ({
                ...prevData,
                address: { ...prevData.address, [name]: value }
            }));
        } else {
            setUserData(prevData => ({ ...prevData, [name]: value }));
        }
    };
    
    const handleEditClick = () => {
        setOriginalUserData(userData);
        setIsEditing(true);
    }
    
    const handleCancelClick = () => {
        setUserData(originalUserData);
        setIsEditing(false);
    }

    // Submits updated name and address
    const onProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: userData.name,
                address: userData.address
            }
            const response = await axios.post(backendUrl + '/api/user/updateProfile', payload, { headers: { token } });

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating profile.");
        } finally {
            setLoading(false);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
        toast.info("You have been logged out.");
    };

    return (
        <div className='border-t pt-14 pb-20'>
            <div className="text-2xl text-center mb-10">
                <Title text1={"MY"} text2={"PROFILE"} />
            </div>

            <form onSubmit={onProfileUpdate} className='max-w-4xl mx-auto'>
                <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
                    {/* Left Side */}
                    <div className='w-full md:w-1/3 flex flex-col items-center text-center'>
                        
                        {/* --- REPLACED IMAGE WITH ICON --- */}
                        <FaUserCircle size={128} style={{ color: "#A1876F" }} />

                        <h2 className='text-2xl font-medium mt-4' style={{ color: "#40350A" }}>
                            {userData.name}
                        </h2>
                        <p className='text-sm mt-1' style={{ color: "#A1876F" }}>{userData.email}</p>
                        <div className='mt-8 w-full bg-[#f0e1c64d] border border-[#A1876F] rounded-lg p-4'>
                            <p className='text-sm font-semibold' style={{ color: "#40350A" }}>TARA COINS</p>
                            <p className='text-4xl font-bold mt-1' style={{ color: "#40350A" }}>{coin}</p>
                        </div>
                        <button type="button" onClick={logoutHandler} className='w-full mt-4 py-3 text-sm font-medium border border-[#A1876F] hover:bg-[#f0e1c64d] hover:text-white transition-colors' style={{ color: "#A1876F" }}>
                            LOGOUT
                        </button>
                    </div>

                    {/* Right Side */}
                    <div className='w-full md:w-2/3'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-xl font-semibold' style={{ color: "#40350A" }}>Account Details</h3>
                            {!isEditing && (
                                <button type="button" onClick={handleEditClick} className='text-sm font-medium' style={{ color: "#40350A" }}>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className='space-y-4'>
                             <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {/* Name */}
                                <div className='sm:col-span-2'>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Full Name</label>
                                    <input name="name" onChange={onChangeHandler} value={userData.name} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                                {/* Email (Read-only) */}
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Email Address</label>
                                    <input name="email" value={userData.email} type="email" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={true}/>
                                </div>
                                {/* Phone (Read-only) */}
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Phone Number</label>
                                    <input name="phone" value={userData.phone} type="tel" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={true}/>
                                </div>
                            </div>
                            <hr className='my-4' style={{borderColor: "#D8C5A1"}}/>
                            <h3 className='text-lg font-semibold' style={{ color: "#40350A" }}>Delivery Address</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {/* Address Fields */}
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Street</label>
                                    <input name="street" onChange={onChangeHandler} value={userData.address.street} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>City</label>
                                    <input name="city" onChange={onChangeHandler} value={userData.address.city} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>State</label>
                                    <input name="state" onChange={onChangeHandler} value={userData.address.state} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                                <div>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Zip Code</label>
                                    <input name="zipcode" onChange={onChangeHandler} value={userData.address.zipcode} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                                <div className='sm:col-span-2'>
                                    <label className='text-sm font-medium' style={{ color: "#40350A" }}>Country</label>
                                    <input name="country" onChange={onChangeHandler} value={userData.address.country} type="text" className="w-full mt-1 px-3 py-2 border rounded-md disabled:bg-gray-100" style={{ borderColor: "#A1876F", color: "#A1876F" }} disabled={!isEditing} required/>
                                </div>
                            </div>

                            {isEditing && (
                                <div className='flex gap-4 pt-4'>
                                    <button type="submit" className="w-full py-3 text-sm font-medium flex justify-center items-center" style={{ backgroundColor: "#40350A", color: "#F0E1C6" }} disabled={loading}>
                                        {loading ? <ClipLoader size={20} color="#F0E1C6" /> : "SAVE CHANGES"}
                                    </button>
                                    <button type="button" onClick={handleCancelClick} className="w-full py-3 text-sm font-medium border" style={{ borderColor: "#A1876F", color: "#A1876F" }}>
                                        CANCEL
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;