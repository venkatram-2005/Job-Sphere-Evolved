import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ExperienceHome from './pages/ExperienceHome'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/DashBoard'
import AddJob from './pages/AddJob'
import AddExperience from './pages/AddExperience'
import ManageJobs from './pages/ManageJobs'
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ViewExperience from './pages/ViewExperience'
import Analyzer from './pages/Analyzer'
import CreateResume from './pages/CreateResume'

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext)

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/experiences' element={<ExperienceHome />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/experiences/:id' element={<ViewExperience />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/analyzer' element={<Analyzer />} />
        <Route path="/create-resume" element={<CreateResume/>} />
        {/* Dashboard with nested routes */}
        <Route path='/dash-board' element={<Dashboard />}>
          {/* Only render these routes if companyToken is present */}
          {companyToken && (
            <>
              <Route path='add-job' element={<AddJob />} />
              <Route path='manage-jobs' element={<ManageJobs />} />
              <Route path='add-experience' element={<AddExperience />} />
              {/* <Route path='manage-experiences' element={<ManageExperiences />} /> */}
            </>
          )}
        </Route>
      </Routes>
    </div>
  )
}

export default App
