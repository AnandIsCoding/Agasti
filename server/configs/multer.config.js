import multer from "multer";

/**
 * ✅ Memory storage
 * - No local uploads folder
 * - Provides file.buffer
 * - Required for direct Cloudinary upload
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

export default upload;
