import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT || 7000;

export const DATABASE_URL = process.env.DATABASE_URL || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
export const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

export const SECRET_KEY = process.env.SECRET_KEY;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET_KEY = process.env.CLOUDINARY_API_SECRET_KEY;
export const CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;

// payment related

export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
export const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
export const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
export const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;
