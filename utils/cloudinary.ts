import cloud, { v2 } from "cloudinary";
const cloudinary: typeof v2 = cloud.v2;
// import dotenv from "dotenv";
// dotenv.config();

cloudinary.config({
  cloud_name:"ndtech",
  api_key:"414962129865933",
  api_secret:"HwOGA6ka8RsN0gI4Adr_xnFD05M",
});

export default cloudinary;