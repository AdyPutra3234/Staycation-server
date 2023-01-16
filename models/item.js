const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const item = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        default: 'Indonesia',
    },
    city: {
        type: String,
        required: true,
    },
    isPopular: {
        type: Boolean,
        default: false,
    },
    unit: {
        type: String,
        default: 'night'
      },
    sumBooking: {
        type: Number,
        default: 0
    },
    categoryId: [{
        type: ObjectId,
        ref: 'category',
    }],
    imageId: [{
        type: ObjectId,
        ref: 'image',
    }],
    featureId: [{
        type: ObjectId,
        ref: 'feature',
    }],
    activityId: [{
        type: ObjectId,
        ref: 'activity',
    }],
});

module.exports = mongoose.model('item', item);