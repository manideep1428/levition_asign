import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "doll04fa1",
  api_key: process.env.CLOUDINARY_API_KEY ||  "675161255564718",
  api_secret: process.env.CLOUDINARY_API_SECRET || "N1ALPVVy4tp_r6dbbPJ3cSQnxDs",
});

export default cloudinary;
