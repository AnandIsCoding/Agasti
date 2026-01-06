import { v2 as cloudinary } from "cloudinary";
const uploadBufferToCloudinary = (buffer, folder, mimetype) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          format: mimetype.split("/")[1],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export default uploadBufferToCloudinary;
