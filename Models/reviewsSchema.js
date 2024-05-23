const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({

    reviewTitle:{
        type: String,
        required: [true, 'Please add a review heading']
    },
    
    reviewDescription: {
        type: String,
        required: [true, 'Please add a review']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'service'
    },
    rating: {
        type: Number,
        default: 0
    },
    replies: {
        type: Array,
        default: []
    }
},{timestamps: true});

module.exports = mongoose.model('reviews', reviewSchema);