import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageExperiences = () => {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([])
  const { backendUrl, companyToken } = useContext(AppContext)

  // Fetch company's experiences
  const fetchCompanyExperiences = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-experiences`, {
        headers: { token: companyToken }
      })
      if (data.success) {
        setExperiences(data.exp.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Change experience visibility
  const changeExperienceVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-experience-visibility`,
        { id },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCompanyExperiences()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyExperiences()
    }
  }, [companyToken])

  return experiences ? experiences.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl'>No Experiences Posted or Available</p>
    </div>
  ) : (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left'>#</th>
              <th className='py-2 px-4 border-b text-left'>Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Category</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Company</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                <td className='py-2 px-4 border-b'>{exp.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{exp.category}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{exp.company}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(exp.date).format('ll')}</td>
                <td>
                  <input
                    type="checkbox"
                    className='scale-125 ml-4'
                    checked={exp.visible}
                    onChange={() => changeExperienceVisibility(exp._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button
          onClick={() => navigate('/dash-board/add-experience')}
          className='bg-black text-white py-2 px-4 rounded'
        >
          Add new experience
        </button>
      </div>
    </div>
  ) : <Loading />
}

export default ManageExperiences
