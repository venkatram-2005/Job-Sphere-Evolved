import Company from '../models/Company.js'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from '../utils/generateToken.js'
import Job from '../models/Job.js'
import JobApplication from '../models/JobApplication.js'

//Register the Company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.json({ success: false, message: "Company already registered" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });


    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//Login the Company
export const loginCompany = async (req, res) => {
    const { email, password } = req.body
    try {
        const company = await Company.findOne({ email })
        if (await bcrypt.compare(password, company.password)) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });
        }
        else {
            res.json({ success: false, message: "Invalid Email or Password" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get company data
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company;

        res.json({ success: true, company });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

//Post a Job
export const postJob = async (req, res) => {
    const { title, description, location, salary, level, category, link, imgurl, name } = req.body
    const companyId = req.company._id
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category,
            link,
            imgurl,
            name,
        })
        await newJob.save()
        res.json({ success: true, newJob })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Post an Experience
export const postExperience = async (req, res) => {
    const { title, description, salary, level, category, imgurl, name, company } = req.body
    const companyId = req.company._id
    try {
        const newJob = new Job({
            title,
            description,
            salary,
            companyId,
            date: Date.now(),
            level,
            category,
            imgurl,
            name,
            company,
        })
        await newExperience.save()
        res.json({ success: true, newJob })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Job applicants of Company
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id

        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location category level salary')
            .exec()

        return res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Get Company's posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;

        const jobs = await Job.find({ companyId });

        // Adding No. of applicants info in data

        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id });
            return { ...job.toObject(), applicants: applicants.length }
        }))

        res.json({ success: true, jobsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Change Job visibility
export const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body;

        const companyId = req.company._id;

        const job = await Job.findById(id);

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
        }

        await job.save();

        res.json({ success: true, job }); // Moved inside try block
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



