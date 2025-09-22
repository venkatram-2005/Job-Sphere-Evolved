import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const {backendUrl, userData, userApplications, fetchUserData, fetchUserApplications} = useContext(AppContext)
  
  const {user} = useUser()
  const {getToken} = useAuth()

  const updateResume = async()=>{
    try {
      const formData = new FormData()
      formData.append('resume',resume)

      const token = await getToken()
      const {data} = await axios.post(backendUrl+'/api/users/update-resume'
        ,formData, 
        {headers : {Authorization : `Bearer ${token}`}}
      )

      if(data.success){
        toast.success(data.message)
        await fetchUserData()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setIsEdit(false)
    setResume(null)
  }

  useEffect(()=>{
    if(user){
      fetchUserApplications()
    }
  },[user])
  
  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);
  
  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65v] 2xl:px-20 mx-auto my-10'>
        <h2 className='test-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isEdit || userData && userData.resume === ""
            ? <>
              <label htmlFor="resumeUpload" className='flex items-center'>
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select Resume"}</p>
                <input onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" id='resumeUpload' hidden />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button onClick={updateResume} className='bg-green-200 text-green-600 px-4 py-2 rounded-lg mr-2'>Save</button>
            </>
              : <div className='flex gap-2'>
                <a target='_blank' href={userData?.resume || "#"}  className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>Resume</a>
                <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button>
              </div>
          }
        </div>

        {/* List of applied Jobs */}

        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
            </tr>
          </thead>
          <tbody>
              {userApplications.map((job, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    {job?.companyId?.image ? (
                      <img
                        src={job.companyId.image}
                        alt={job?.companyId?.name || "Company"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No logo</span>
                    )}
                  </td>

                  <td className="py-2 px-4 border-b">
                    {job?.jobId?.title || "No title"}
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job?.jobId?.location || "No location"}
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job?.date ? moment(job.date).format("LL") : "No date"}
                  </td>

                </tr>
              ))}
            </tbody>

        </table>
      </div>
      <Footer/>
    </>
  )
}

export default Applications
