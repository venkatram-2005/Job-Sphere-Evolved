import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    name: {type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: String, required: true },
    link: { type: String, required: true },
    imgurl:{type: String, required: true},
    date: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    embedding: {
        type: [Number],  // array of floats
        default: []
    },

});

const Job = mongoose.model('Job', jobSchema);

export default Job;
