// Import necessary modules
import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
} from "./server.config.js";

// Function to establish a connection with Cloudinary
const connectToCloudinary = async () => {
  try {
    // Configure Cloudinary with credentials from environment variables
    await cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
      api_key: CLOUDINARY_API_KEY, // Cloudinary API key
      api_secret: CLOUDINARY_API_SECRET_KEY, // Cloudinary API secret key
    });
  } catch (error) {
    // Log an error message in red if connection fails
    console.error(
      chalk.redBright(
        "Error in connectToCloudinary in cloudinary.config.js ---->> ",
        error.message,
      ),
    );
  }
};

export default connectToCloudinary;
