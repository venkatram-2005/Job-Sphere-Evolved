import express from 'express'
import {changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany, postExperience } from '../controllers/companyController.js'
const router = express.Router()
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

// Register a company
router.post('/register',upload.single("image"), registerCompany)

//Company Login
router.post('/login', loginCompany)

//Get Company Data
router.get('/company',protectCompany, getCompanyData)

//Post a Job
router.post('/post-job', protectCompany,postJob)

//Post an Experience
router.post('/post-experience', protectCompany,postExperience)

//Get Applicants Data of Company
router.get('/applicants',protectCompany, getCompanyJobApplicants)

//Get Company Job list
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)


//Change Application Visibility
router.post('/change-visibility',protectCompany, changeVisibility)

export default router
