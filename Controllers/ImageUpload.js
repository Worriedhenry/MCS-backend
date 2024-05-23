const express = require('express');
const upload = require('../Middlewares/multerConfig');
const fs = require('fs');
const User = require('../Models/userSchema');
const cloudinary = require('../Middlewares/cloudinary');
require('dotenv').config()
const app = express();

app.post('/uploadimage', upload.single('image'), async (req, res) => {
    try {
        // console.log(req.file,req.body.file)
        const result = await cloudinary?.uploader?.upload(req.file.path);
        const publicId = result?.public_id;
        const url = result.secure_url;
        // console.log(publicId,url)
        res.send({ publicId, url });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});


app.put("/updateimage/:userId", upload.single('image'), async (req, res) => {
    try {
        const userId = req.params.userId 
        const result = await cloudinary?.uploader?.upload(req.file.path);
        const publicId = result?.public_id;
        const url = result.secure_url;
        const user = await User.findOneAndUpdate({ _id: userId }, { profilePic: url })
        // console.log(publicId,url)
        res.send(url);
    }catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
})


app.delete('/deleteimage/:publicId', async (req, res) => {
    try {
        // console.log(req.params.publicId)
        const result = await cloudinary?.uploader?.destroy(req.params.publicId);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});

app.put('/deleteimagefromurl', async (req, res) => {
    try {
        
        const {publicUrl,userId} = req.body;
        const publicId = publicUrl.split('/').pop().split('.')[0];
        const result = await cloudinary?.uploader?.destroy(publicId);
        if (result){
            const user= await User.findOneAndUpdate({_id:userId},{profilePic:null})
        }
        res.status(200).send("ok");
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});

app.get("/test", (req, res) => {
    res.send("hello");
});

module.exports = app;
