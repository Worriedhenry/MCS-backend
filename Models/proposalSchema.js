const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const proposalSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: 'services',
        required: [true, 'Please add a service']
    },
    serviceProvider:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please add a client']
    },
    client:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please add a client']
    },
    proposalBrief:{
        type: String,
        required: [true, 'Please add a brief']
    },
    proposalStatus:{
        type: Number,
        default: 1
    },
    
    proposedPrice: {
        type: Number,
        default: []
    },
    proposedCurrency: {
        type: String,
        default:"$"
    },
    proposedPayRate:{
        type:String,
        default:"Per hour"
    },
    proposedDeadline: {
        type: Date,
        default:"N/A"
    },
    paymentMethod:{
        type:String,
        default:"N/A"
    },
    referenceLink:{
        type:String,
        default:"N/A"
    },
    logs:{
        type:Array,
        default:[]
    },
    archived:{
        type:Array,
        default: []
    }
},{timestamps: true})

module.exports= mongoose.model('serviceProposal', proposalSchema)