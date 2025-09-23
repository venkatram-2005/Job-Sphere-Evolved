import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
      name: {type: String, required: true},
      title: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      level: { type: String, required: true },
      salary: { type: String, required: true },
      imgurl:{type: String, required: true},
      company: { type: String, required: true },
      date: { type: Number, required: true },
      visible: { type: Boolean, default: true },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
