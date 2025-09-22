import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import jobsphere from "../assets/jobsphere.png";
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
const DashBoard = () => {
  const navigate = useNavigate()
  const {companyData, setCompanyData, setCompanyToken} = useContext(AppContext)

  // Function to logout 
  const logout = () =>{
    setCompanyToken(null)
    localStorage.removeItem('companyToken')
    setCompanyData(null)
    navigate('/')
  }

  useEffect(()=>{
    if(companyData){
      navigate('/dashboard/manage-jobs')
    }
  },[companyData])


  return (
    <div className='min-h-screen'>
      {/* NavBar for Recruiter Panel */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <img src={jobsphere} onClick={()=>navigate('/')} alt="JobSphere Logo" className="w-50 h-10 cursor-pointer max-sm:w-30 h-10" />
          {companyData && 
            <div className='flex item-center gap-1'>
            <p className='max-sm:hidden'>Welcome, {companyData.name}</p>
              <div className='relative group'>
                <img className='w-8 border rounded-full' src={companyData.image} alt="" />
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                  <ul className='list-none m-0 p-2 bg-white rounded-xl border text-sm hover:bg-red-600 hover:text-white transition-colors duration-200'>
                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10 '>Logout</li>
                  </ul>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <div className='flex items-start'>
          {/* Left Side Bar */}
          <div className='inline-block min-h-screen border-r-2'>
            <ul className='flex flex-col items-start p5 text-gray-800'>
              <NavLink className={({isActive})=>` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/add-job'}>
                <img className='min-w-4' src={assets.add_icon} alt="" />
                <p className='max-sm:hidden'>Add Job</p>
              </NavLink>

              <NavLink className={({isActive})=>` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/manage-jobs'}>
                <img className='min-w-4' src={assets.home_icon} alt="" />
                <p className='max-sm:hidden'>Manage Jobs</p>
              </NavLink>

              <NavLink className={({isActive})=>` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/view-applications'}>
                <img className='min-w-4' src={assets.person_tick_icon} alt="" />
                <p className='max-sm:hidden'>View Applications</p>
              </NavLink>
            </ul>
          </div>

          <div className='flex-1 h-full p-2 sm:p-5'>
            <Outlet />
          </div>

      </div>
    </div>
  )
}

export default DashBoard
