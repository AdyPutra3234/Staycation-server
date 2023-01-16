const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const category = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    itemId: [{
        type: ObjectId,
        ref: 'item',
    }],
});

module.exports = mongoose.model('category', category);