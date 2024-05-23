const express = require('express');
const app = express();
const serviceSchema = require('../Models/serviceSchema');
const User = require('../Models/userSchema');
const proposalSchema = require('../Models/proposalSchema');
const reviewSchema = require('../Models/reviewsSchema');

app.post("/proposal/create", async (req, res) => {
    try {
        const { service, client, proposalDate, proposalBrief, proposalStatus, proposedPrice, proposedCurrency, proposedPayRate, proposedDeadline, paymentMethod, referenceLink, serviceProvider, logs } = req.body;


        const newProposal = new proposalSchema({
            service, client, proposalDate, proposalBrief, proposalStatus, proposedPrice, proposedCurrency, proposedPayRate, proposedDeadline, paymentMethod, referenceLink, serviceProvider, logs
        });
        await serviceSchema.findOneAndUpdate({_id:service},{$inc:{serviceRequested:1}})
        // console.log(proposedDeadline)
        await newProposal.save();
        res.status(201).json(newProposal);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
    }

}
)

app.get("/proposal/getproposal/:userId/:page", async (req, res) => {
    const { userId, page } = req.params
    try {
        const proposals = await proposalSchema.find({
            $or: [
                { client: userId },
                { serviceProvider: userId }
            ],
            archived: { $nin: [userId] }
        }).sort({ createdAt: -1 }).skip((page - 1) * 5).limit(5).populate({
            path: "service",
            select: "serviceName serviceCost serviceCostCurrency serviceCostDuration",
        }).populate({
            path: "serviceProvider",
            select: "username"
        }).populate({
            path: "client",
            select: "username"
        })

        res.json(proposals)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

app.get("/proposal/archives/:userId",async (req,res)=>{
    const {userId}=req.params
    try{ 
        const proposals = await proposalSchema.find({
            $or: [
                { client: userId },
                { serviceProvider: userId }
            ],
            archived:{$in:userId}
           
        }).sort({ createdAt: -1 }).populate({
            path: "service",
            select: "serviceName serviceCost serviceCostCurrency serviceCostDuration",
        }).populate({
            path: "serviceProvider",
            select: "username"
        }).populate({
            path: "client",
            select: "username"
        })

        res.status(200).send(proposals)

    }catch(err){
        console.log(err)
        res.status(400).json({message:err.message})

    }
})

app.get("/proposal/getproposaldetails/:id", async (req, res) => {
    const { id } = req.params
    try {
        const proposal = await proposalSchema.findById(id).populate({
            path: "service",
            select: "serviceName serviceCost serviceCostCurrency serviceCostDuration",
        }).populate({
            path: "serviceProvider",
            select: "username"
        }).populate({
            path: "client",
            select: "username"
        })
        const proposalObject = proposal.toObject();


        proposalObject.year = proposal.createdAt.getFullYear();
        proposalObject.month = proposal.createdAt.getMonth() + 1;
        proposalObject.date = proposal.createdAt.getDate();
        proposalObject.hour = proposal.createdAt.getHours();
        proposalObject.minute = proposal.createdAt.getMinutes();

        // console.log(proposalObject);
        res.json(proposalObject);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})


app.put("/proposal/updateproposal/:id", async (req, res) => {
    const { id } = req.params
    const { proposalStatus, log } = req.body
    try {
        // I want to update the value of proposalStatus and add the log into logs
        const result = await proposalSchema.findOneAndUpdate(
            { _id: id },
            {
                $set: { proposalStatus: proposalStatus },
                $push: { logs: log }
            },
        );
        if (proposalStatus==4){
            await serviceSchema.findOneAndUpdate({ _id: result.service }, { $inc: { serviceCompleted: 1 } });
        }
        if(proposalStatus==-2){
            await User.findOneAndUpdate({_id:result.client},{ $inc: { abandonedProposals: 1 } });
        }
        res.status(204).send("ok")
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

app.put("/proposal/archiveproposal/:id", async (req, res) => {
    const { id } = req.params
    try {
        const { userId } = req.body
        const result = await proposalSchema.findOneAndUpdate({ _id: id }, { $push: { archived: userId } });
        res.status(204).send("ok")
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

app.put("/proposal/unarchiveproposal/:id", async (req, res) => {
    const { id } = req.params
    try {
        const { userId } = req.body
        const result = await proposalSchema.findOneAndUpdate({ _id: id }, {  $pull: { archived: userId } });
        res.status(204).send("ok")
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})
app.put("/proposal/completeproposal/:id", async (req, res) => {
    const { id } = req.params
    try{
        const {proposalStatus,log,reviewTitle,reviewDescription,rating,serviceId,userId}=req.body

        const result = await proposalSchema.findOneAndUpdate({ _id: id }, {$set:{proposalStatus:proposalStatus},$push:{logs:log}});
        const newReview=new reviewSchema({reviewTitle,reviewDescription,rating,serviceId,userId})
        await newReview.save()
        res.status(204).send("ok")

    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})
module.exports = app;