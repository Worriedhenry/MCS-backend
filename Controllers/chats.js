const express=require('express');
const app=express();
const reviewSchema = require('../Models/reviewsSchema');
const serviceSchema = require('../Models/serviceSchema');
const userSchema=require('../Models/userSchema');
const chatSchema = require('../Models/chatsSchema');
// import {io} from "../server.js";
// import {userSockets} from "../utils/socket";

app.post("/chats/createroom", async (req, res) => {
    const { client, serviceProvider, proposalId } = req.body
    try{
        const result = await userSchema.findOneAndUpdate({ _id: client }, { $push: { chatRooms:proposalId  } })
        const res1 = await userSchema.findOneAndUpdate({ _id: serviceProvider }, { $push: { chatRooms: proposalId } })
        res.status(201).json({ client, serviceProvider, proposalId })
    }
    catch(err){
        console.log(err)
        res.status(400).json({ message: err.message })
    }

})

async function getRoomId(userId){
    try{
        const result=await userSchema.findOne({ _id: userId },{chatRooms:1, _id:0})
        return result.chatRooms
    }catch(err){
        console.log(err)
        return []
    }

}

app.get("/chats/:roomId/:page",async(req,res)=>{
    try{
        
        const {roomId,page}=req.params
        const result=await chatSchema.find({proposalId:roomId}).sort({createdAt:-1}).skip((page-1)*10).limit(10).exec()
        res.status(200).json(result.reverse())

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get("/chats/getRooms/:userId/:page",async(req,res)=>{
    try{
        const {userId,page}=req.params
    }catch(err){
        console.log(err)
    }
})

app.post("/chats/storemessage", async (req, res) => {
    const { clientId, serviceProvider, message, proposalId } = req.body
    try{
        const result = await chatSchema.create(req.body)
        res.status(201).send("Message stored successfully")
    }
    catch(err){
        console.log(err)
        res.status(400).json({ message: err.message })
    }
})

// const getRoomId=5;
module.exports.getRoomId = getRoomId;
module.exports.chats = app