import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddExperience = () => {

  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [imgurl, setImgUrl] = useState('')
  const [category, setCategory] = useState('Software Developer')
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState('')
  const [loading, setLoading] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const {backendUrl, companyToken} = useContext(AppContext)

  const onSubmitHandler = async(e) =>{
    e.preventDefault()
    setLoading(true)
    try {
      const description = quillRef.current.root.innerHTML
      const {data} = await axios.post(backendUrl+'/api/company/post-experience', 
        {title, description, salary, category, level, imgurl, name, company},
        {headers:{token:companyToken}}
      )

      if(data.success){
        toast.success("Experience Posted Successfully")
        setTitle('')
        setCompany('')
        setName('')
        setImgUrl('')
        setLevel('Beginner Level')
        setSalary('')
        quillRef.current.root.innerHTML = ""
      }
      else{
        toast.error(data.message)
      }      
    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    //Initiate quill only once
    if(!quillRef.current && editorRef){
      quillRef.current = new Quill(editorRef.current,{
        theme:'snow',
      })
    }
  },[])

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Author Name</p>
        <input type="text" placeholder='Type here'
          onChange={e => setName(e.target.value)}
          value={name}
          required 
          className=' w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Company Name</p>
        <input type="text" placeholder='Type here'
          onChange={e => setCompany(e.target.value)}
          value={company}
          required 
          className=' w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input type="text" placeholder='Type here'
          onChange={e => setTitle(e.target.value)}
          value={title}
          required 
          className=' w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
      </div>

      <div className='w-full max-w-lg'>
        <p className='my-2'>Experience</p>
        <div ref={editorRef}>
        </div>
      </div>

       <div className="w-full flex gap-6">
          {/* Job Category */}
          <div className="flex flex-col">
            <p className="mb-2">Job Category</p>
            <select 
              className="px-3 py-2 border-2 border-gray-300 rounded"
              onChange={e => setCategory(e.target.value)}
            >
              {JobCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Job Level */}
          <div className="flex flex-col">
            <p className="mb-2">Job Level</p>
            <select 
              className="px-3 py-2 border-2 border-gray-300 rounded"
              onChange={e => setLevel(e.target.value)}
            >
              <option value="Beginner level">Beginner Level</option>
              <option value="Intermediate Level">Intermediate Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>
        </div>

       <div className='w-full'>
          <p className='mb-2'>Company image url</p>
          <input type="text" placeholder='Type here'
            onChange={e => setImgUrl(e.target.value)}
            value={imgurl}
            required 
            className=' w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
        </div>
       
       <div className='container p-4 flex flex-col w-full items-start gap-3'>
            <div className='w-full'>
            <p className='mb-2'>Job Salary Range</p>
            <input className='w-full px-3 py-3 border-2 border-gray-300 rounded sm:w-[120px]' onChange={e=>setSalary(e.target.value)} type="String" placeholder='2500' />
            </div>
        </div>


       <button 
          className='ml-5 w-28 py-3 mt-4 bg-black text-white rounded flex justify-center items-center'
          disabled={loading}
        >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "ADD"
            )}
          </button>

    </form>

  )
}

export default AddExperience
