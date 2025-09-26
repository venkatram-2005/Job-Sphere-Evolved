import multer from "multer";

// Store uploaded files in memory (req.file.buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
