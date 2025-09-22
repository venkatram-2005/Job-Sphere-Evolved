import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const { backendUrl } = useContext(AppContext)

  const handleSubscribe = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/subscribe', { email });
      if (response.data.message) {
        toast.success(response.data.message);
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className='container px-4 2xl:px-20 mx-auto my-20'>
      <div className='relative bg-gradient-to-r from-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded lg'>
        <div className="max-w-xl w-full">
          <h1 className="text-2xl sm:text-4xl font-bold mb-8">
            Subscribe to our newsletter for daily job updates
          </h1>
          <div className="w-full">
            <div className="flex items-center justify-between bg-white rounded text-gray-600 pl-4 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-sm:text-xs p-2 rounded outline-none w-full"
              />
              <button
                className="bg-blue-600 px-6 py-2 rounded text-white m-1"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <img className='absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden' src={assets.app_main_img} alt="" />
      </div>
    </div>
  );
};

export default Subscribe;
