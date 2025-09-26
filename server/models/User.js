import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String },
  image: { type: String, required: true },
  resumeEmbedding: {
    type: [Number], // array of floats
    default: []
  },
});

const User = mongoose.model("User", userSchema);

export default User;
