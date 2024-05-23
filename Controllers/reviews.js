const express=require('express');
const app=express();
const reviewSchema = require('../Models/reviewsSchema');
const serviceSchema = require('../Models/serviceSchema');


app.get("/reviews/:serviceId/:page", async (req, res) => {
    const { serviceId, page } = req.params
    try{
        const reviews = await reviewSchema.find({serviceId:serviceId}).sort({ createdAt: -1 }).skip((page - 1) * 5).limit(5).populate({
            path: "userId",
            select: "username profilePic"
        })
        return res.status(200).send(reviews)
    }catch(err){
        console.log(err)
        res.status(400).json({ message: err.message })
    }
})


module.exports=app

