import React, { useContext, useState } from 'react'
import jobsphere from "../assets/jobsphere.png";
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const navigate = useNavigate()
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { setShowRecruiterLogin } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        
        {/* Logo */}
        <img 
          src={jobsphere} 
          onClick={() => navigate('/')} 
          alt="JobSphere Logo" 
          className="w-35 h-9 cursor-pointer" 
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center">
          <ul className="list-none flex gap-6">
            <li><Link to="/" className="text-black hover:text-gray-500 transition duration-300">Explore Jobs</Link></li>
            {/* <li>
              <a
                href="https://jobsphere-resume-maker.vercel.app/"
                className="text-black hover:text-gray-500 transition duration-300"
                target="_blank"      // opens in new tab
                rel="noopener noreferrer" // security best practice
              >
                Create Resume
              </a>
            </li> */}

            <li><Link to="/create-resume" className="text-black hover:text-gray-500 transition duration-300">Create Resume</Link></li>
            <li><Link to="/analyzer" className="text-black hover:text-gray-500 transition duration-300">Resume Analyzer</Link></li>
            <li><Link to="/experiences" className="text-black hover:text-gray-500 transition duration-300">Past Experiences</Link></li>
          </ul>
        </div>

        {/* Right side (User / Login buttons) */}
        <div className="hidden md:flex items-center gap-4">
          {
            user ? (
              <div className='flex items-center gap-1'>
                <Link to={'/applications'} className="hover:text-gray-600">Applied Jobs</Link>
                <p>|</p>
                <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName}</p>
                <UserButton />
              </div>
            ) : (
              <div className='flex gap-4 max-sm:text-xs'>
                <button 
                  onClick={() => setShowRecruiterLogin(true)} 
                  className='text-gray-600 ml-2'
                >
                  Contributer Login
                </button>
                <button 
                  onClick={() => openSignIn()} 
                  className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:mr-3'
                >
                  Login
                </button>
              </div>
            )
          }
        </div>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4">
          <ul className="list-none flex flex-col items-center gap-4">
            <li><Link to="/" className="text-black hover:text-gray-500 transition duration-300" onClick={() => setIsOpen(false)}>Explore Jobs</Link></li>
            <li><Link to="/resume" className="text-black hover:text-gray-500 transition duration-300" onClick={() => setIsOpen(false)}>Create Resume</Link></li>
            <li><Link to="/analyzer" className="text-black hover:text-gray-500 transition duration-300" onClick={() => setIsOpen(false)}>Resume Analyzer</Link></li>
            <li><Link to="/relevant-jobs" className="text-black hover:text-gray-500 transition duration-300" onClick={() => setIsOpen(false)}>Relevant Jobs</Link></li>
          </ul>
          <div className="mt-4 flex flex-col items-center gap-3">
            {
              user ? (
                <div className='flex flex-col items-center gap-2'>
                  <Link to={'/applications'} onClick={() => setIsOpen(false)}>Applied Jobs</Link>
                  <p>Hi, {user.firstName + " " + user.lastName}</p>
                  <UserButton />
                </div>
              ) : (
                <div className='flex flex-col items-center gap-3'>
                  <button 
                    onClick={() => { setShowRecruiterLogin(true); setIsOpen(false) }} 
                    className='text-gray-600'
                  >
                    Contributer Login
                  </button>
                  <button 
                    onClick={() => { openSignIn(); setIsOpen(false) }} 
                    className='bg-blue-600 text-white px-6 py-2 rounded-full'
                  >
                    Login
                  </button>
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
