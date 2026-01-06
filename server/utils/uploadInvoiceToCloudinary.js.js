import { v2 as cloudinary } from "cloudinary";
import chalk from "chalk";

/**
 * Upload PDF buffer directly (NO local file)
 */
const uploadInvoiceToCloudinary = (pdfBuffer, orderId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pluto-intero/invoices",
        resource_type: "raw",
        public_id: `invoice-${orderId}.pdf`,
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error(
            chalk.redBright("❌ Cloudinary Invoice Upload Failed"),
            error.message,
          );
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(pdfBuffer);
  });
};

export default uploadInvoiceToCloudinary;
