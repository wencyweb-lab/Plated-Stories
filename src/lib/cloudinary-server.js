import { v2 as cloudinary } from "cloudinary";

// Server-only: uses the API secret, so this file must never be imported
// from a Client Component. Use it in Route Handlers / Server Actions for
// signed operations (uploads, deletions, signed transformation URLs).
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

export default cloudinary;
