const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const serviceSchema = require('../Models/serviceSchema');
const UsersSchema = require('../Models/userSchema');
const reviewSchema = require('../Models/reviewsSchema')
app.post('/services/create', async (req, res) => {
    try {

        const { serviceName, serviceBrief, serviceTags, complexity, workSamples, serviceCost, serviceCostDuration, serviceCostCurrency, serviceDeadline, userToken } = req.body
        const token = jwt.verify(userToken, process.env.JWT_SECRET)
        const serviceProvider = new ObjectId(String(token.id))
        const service = new serviceSchema({
            serviceName, serviceBrief, serviceTags, complexity, workSamples, serviceProvider, serviceCost, serviceCostDuration, serviceCostCurrency, serviceDeadline,
        })

        // Cheak Id of serviceProvider
        const userExist = await UsersSchema.findOne({ _id: serviceProvider }, { _id: 1 })
        if (!userExist) {
            res.status(403).send("invalid token")
        }

        const res1 = await service.save()
        if (!res1.status == 200) {
            res.status(403).send("invalid token")
        }
        // Add new service id to services array of serviceProvider

        const res2 = await UsersSchema.findOneAndUpdate({ _id: token.id }, { $push: { services: res1._id } })
        if (res2) {
            return res.status(200).send({ id: res1.id })
        }
        // In case we are not able to add the service id to user we delete the service

        const res3 = await serviceSchema.findByIdAndDelete(res1._id)
        return res.status(403).send("invalid token")
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.get("/services/getservice/:id", async (req, res) => {
    const id = req.params.id

    const service = await serviceSchema.findOne({ _id: id }).populate({
        path: "serviceProvider",
        select: "fullname username profilePic createdAt about socials phone location email rating reviewCount services avgResponseTime userTags"
    })
        .populate({
            path: "serviceReviews",
            select: "reviewHeading reviewBody reviewDate reviewer reviewedService rating replies",
            options: { sort: { 'createdAt': -1 }, limit: 3 }
        })

    // console.log(service)

    // I want to change the createdAt field to year
    service.serviceProvider.createdAt = new Date(service.serviceProvider.createdAt)
    service.serviceProvider.createdAt = service.serviceProvider.createdAt.getFullYear()

    // service.serviceProvider.createdAt=service.serviceProvider.createdAt.getYear()
    // console.log(service.serviceProvider.createdAt)
    res.send(service)


})

app.post("/services/addreview", async (req, res) => {
    try {
        const { reviewHeading, reviewBody, reviewer, reviewedService, userId } = req.body

        const serviceReview = new reviewSchema({
            reviewHeading, reviewBody, reviewer, reviewedService
        })
        const res1 = await serviceReview.save()
        if (!res1.status == 200) {
            res.status(403).send("invalid token")
        }
        const res2 = await serviceSchema.findOneAndUpdate({ _id: reviewedService }, { $push: { serviceReviews: res1._id } })
    } catch (err) {
        console.log(err)
    }
})

// route to fetch more reviews 
app.get("/services/getreviews/:id", async (req, res) => {
    const id = req.params.id
})

app.get("/services/getfullservice/:id", async (req, res) => {

    const id = req.params.id
    try {

        const service = await serviceSchema.findOne({ _id: id })
        res.send(service)
    } catch (err) {
        console.log(err)
    }
})

app.put("/services/updateservice/:id", async (req, res) => {
    try {

        const id = req.params.id
        const { serviceName, serviceBrief, serviceTags, complexity, workSamples, serviceCost, serviceCostDuration, serviceCostCurrency, serviceDeadline } = req.body

        const result = await serviceSchema.findOneAndUpdate({ _id: id }, { serviceName, serviceBrief, serviceTags, complexity, workSamples, serviceCost, serviceCostDuration, serviceCostCurrency, serviceDeadline })

        res.status(204).send("ok")
    } catch (err) {
        console.log(err)
    }
})

app.delete("/services/deleteservice/:id", async (req, res) => {
    try{
    const id = req.params.id
    const result = await serviceSchema.findByIdAndDelete(id)
    const deleteFromUser=await UsersSchema.updateMany({services:id},{$pull:{services:id}})
    res.status(204).send("ok")
    }catch(err){
        console.log(err)    
    }    
})   

module.exports = app;