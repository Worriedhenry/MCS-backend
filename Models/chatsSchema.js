const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const chatsSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please add a client id']
    },
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please add a service provider id']
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please add a sender id']
    },
    proposalId: {
        type: Schema.Types.ObjectId,
        ref: 'proposalSchema'
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    messageFormat:{
        type: String,
        default: "text"
    },
    read:{
        type: Boolean,
        default: false
    }
    },{timestamps: true})
  
chatsSchema.index({proposalId:1})

module.exports = mongoose.model('chats', chatsSchema)    