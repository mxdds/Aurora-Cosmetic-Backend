import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: "de6bjighp", // Replace with your Cloudinary cloud name
    api_key: "373465515892546", // Replace with your Cloudinary API key
    api_secret: "0c3GUMQ2wwrVmHT84AYBntVmnlo" // Replace with your Cloudinary API secret
});
export default cloudinary;