import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };