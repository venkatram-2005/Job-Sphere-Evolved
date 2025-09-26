import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import pdfToText from 'react-pdftotext'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const {backendUrl, userData, userApplications, fetchUserData, fetchUserApplications} = useContext(AppContext)
  
  const {user} = useUser()
  const {getToken} = useAuth()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    setResume(file)

    try {
      const text = await pdfToText(file)
      setResumeText(text)
    } catch (err) {
      console.error("Failed to extract text from PDF:", err)
      toast.error("Failed to extract text from PDF")
    }
  }

  const updateResume = async () => {
    if (!resume) return toast.error("Please select a resume first")

    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('resumeText', resumeText) // send extracted text too
      // console.log("Resume Text:", resumeText)

      const token = await getToken()
      const {data} = await axios.post(
        backendUrl+'/api/users/update-resume',
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if(data.success){
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
    setResumeText('')
  }

  useEffect(() => {
    if(user) fetchUserApplications()
  }, [user])
  
  useEffect(() => {
    console.log("userData:", userData)
  }, [userData])
  
  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Resume Upload Section */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-xl font-semibold">
            Upload your resume for personalized job recommendations.
          </h2>

          <div className="flex gap-2 mb-6 mt-3 justify-center">
            {isEdit || (userData && userData.resume === "") ? (
              <>
                <label htmlFor="resumeUpload" className="flex items-center">
                  <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                    {resume ? resume.name : "Select Resume"}
                  </p>
                  <input
                    onChange={handleFileChange}
                    accept="application/pdf"
                    type="file"
                    id="resumeUpload"
                    hidden
                  />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button
                  onClick={updateResume}
                  className="bg-green-200 text-green-600 px-4 py-2 rounded-lg mr-2"
                >
                  Save
                </button>
              </>
            ) : (
              <div className="flex gap-2 justify-center">
                <a
                  target="_blank"
                  href={userData?.resume || "#"}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                >
                  Resume
                </a>
                <button
                  onClick={() => setIsEdit(true)}
                  className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Applied Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">Jobs Applied</h2>

          <div className="w-full max-w-4xl">
            <table className="w-full bg-white border rounded-lg text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b">Company Logo</th>
                  <th className="py-3 px-4 border-b">Company Name</th>
                  <th className="py-3 px-4 border-b">Job Title</th>
                  <th className="py-3 px-4 border-b max-sm:hidden">Location</th>
                  <th className="py-3 px-4 border-b max-sm:hidden">Date</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((job, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 flex items-center justify-center gap-2 border-b">
                      {job?.jobId?.imgurl ? (
                        <img
                          src={job?.jobId?.imgurl}
                          alt={job?.jobId?.name || "Company"}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No logo</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{job?.jobId?.name || "No title"}</td>
                    <td className="py-2 px-4 border-b">{job?.jobId?.title || "No title"}</td>
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
        </div>
      </div>
      
      <Footer/>
    </>
  )
}

export default Applications
