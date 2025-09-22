import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {
  const { id } = useParams()

  const [JobData, setJobData] = useState(null)

  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)

  const navigate = useNavigate()

  const {getToken} = useAuth()

  const fetchJob = async () => {
    const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
    try {
      if (data.success) {
        setJobData(data.job)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {
    try {
      if (JobData?.link) {
        // open in new tab
        window.open(JobData.link, "_blank", "noopener,noreferrer");
      } 
      else {
        toast.error("Job application link not found");
      }
    } 
    catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    fetchJob()
  }, [id])

  return JobData ? (
    <>
      <Navbar />

      {/* Job Header */}

      <div className='min-h-screen flex flex-col py-10 container px-4 2container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-ful'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl '>
            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={JobData.companyId.image} alt="" />
              <div className='text-center md:text-left text-nuetral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex item-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}
                  </span>
                  <span className='flex item-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className='flex item-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className='flex item-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC:{kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 text-white px-10 rounded'>Apply Now</button>
              <p className='mt-1 text-gray-600'>Posted {moment(JobData.date).fromNow()}</p>
            </div>
          </div>
        </div>

        {/* Left Side Job Description */}

        <div className='flex flex-col lg:flex-row justify-between items-start'>

          <div className='w-full lg:w-2/3'>
            <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
            <div className='rich-text' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
            <button onClick={applyHandler} className='bg-blue-600 p-2.5 text-white px-10 rounded mt-10'>Apply Now</button>
          </div>

          {/* Right Section */}
          <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
            <h2>More jobs from {JobData.companyId.name}</h2>
            {jobs.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
              .filter(job => {
                // Set of applied job id's
                const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                // Return true if user has not applied for the job
                return !appliedJobsIds.has(job._id)
              }).slice(0, 4)
              .map((job, index) => <JobCard key={index} job={job} />)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob
