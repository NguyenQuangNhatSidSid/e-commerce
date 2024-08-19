import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.LOUDINARY_API_SECRET,
});
export default cloudinary;