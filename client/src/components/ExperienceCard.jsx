import { useNavigate } from 'react-router-dom'

const ExperienceCard = ({exp }) => {

  const navigate = useNavigate()

  return (
    <div className='border p-6 shadow rounded'>
       <div className='flex justify-between items-center'>
            <img className='h-8' src={exp.imgurl} alt="Company Logo" />
       </div>
       <h4 className='font-medium text-xl mt-2'>{exp.title}</h4>
       <div className='flex items-center gap-3 mt-2 text-xs'>
            <span className='bg-blue-50 border-blue-200 px-4 py-1.5 rounded'>{exp.category}</span>
            <span className='bg-red-50 border-red-200 px-4 py-1.5 rounded'>{exp.level}</span>
       </div>
       <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{__html:job.description.slice(0,150)}}></p>
        <div className='mt-4 flex gap-4'>
            <button onClick={()=>{navigate(`/experience/${exp._id}`); scrollTo(0,0)}} className='bg-blue-600 text-white px-4 py-3 rounded'>Apply Now</button>
            <button onClick={()=>{navigate(`/experience/${exp._id}`); scrollTo(0,0)}} className='text-gray-500 border border-gray-500 px-4 py-3 rounded'>Learn More</button>
        </div>
    </div>
  )
}

export default ExperienceCard
