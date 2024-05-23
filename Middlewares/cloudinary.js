const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.API_SECRET,
});
// console.log(process.env.CLOUDNAME)
module.exports = cloudinary;