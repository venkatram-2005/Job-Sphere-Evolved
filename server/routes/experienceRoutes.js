import express from 'express'
import { getExperinceById, getExperiences } from '../controllers/experienceController.js'

const router = express.Router()

// Route to get all jobs data
router.get('/', getExperiences)

// Route to get a single job by ID
router.get('/:id', getExperinceById)

export default router;
