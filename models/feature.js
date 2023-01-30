const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const feature = new mongoose.Schema({
    qty: {
        type: Number,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'feature_category',
    },
    itemId: [{
        type: ObjectId,
        ref: 'item',
    }],
});

module.exports = mongoose.model('feature', feature);