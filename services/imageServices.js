const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

async function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(upload_stream);
  });
}

module.exports = { uploadToCloudinary };
