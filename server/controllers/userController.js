import JobApplication from '../models/JobApplication.js'
import Job from "../models/Job.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'
import { generateEmbedding } from "../utils/embedding.js";
import pdfParse from "pdf-parse"; // install: npm i pdf-parse

// Get user data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }
        console.log(user)
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.auth.userId
    const isAlreadyApplied = await JobApplication.find({ jobId, userId })

    try {
        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' })
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: 'Job Not Found' })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: 'Applied Successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });

    }


}

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary imgurl name')
            .exec();

        if (!applications) {
            return res.json({ success: false, message: 'No applications found' });
        }

        return res.json({ success: true, applications });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });

    }
}

// Update user profile (resume)

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload PDF to Cloudinary using stream
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });

    const uploadResult = await streamUpload(req.file.buffer);
    userData.resume = uploadResult.secure_url;

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // console.log("Extracted Resume Text: ", resumeText);

    // Generate embedding
    const embedding = await generateEmbedding(resumeText);
    userData.resumeEmbedding = embedding;

    await userData.save();

    return res.json({ success: true, message: "Resume Updated" });
  } catch (error) {
    console.error("Resume update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};