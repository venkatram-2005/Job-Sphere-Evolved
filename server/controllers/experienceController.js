import Experience from '../models/Experience.js';

// Get all jobs
export const getExperience = async (req, res) => {
    try {
        const experiences = await Experience.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' });

        res.json({ success: true, experiences });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Get job by single ID
export const getExperienceById = async (req, res) => {
    try {
        const { id } = req.params;

        const experience = await Experience.findById(id).populate({
            path: 'companyId',
            select: '-password'
        });

        if (!experience) {
            return res.json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.json({
            success: true,
            experience
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
