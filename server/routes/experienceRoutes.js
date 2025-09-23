import express from 'express'
import { getExperienceById, getExperience } from '../controllers/experienceController.js'

const router = express.Router()

// Route to get all jobs data
router.get('/', getExperience)

// Route to get a single job by ID
router.get('/:id', getExperienceById)

export default router;
