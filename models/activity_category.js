const mongoose = require('mongoose');

const activity_category = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    imageUrl: {
        type: String,
    }
});

module.exports = mongoose.model('activity_category', activity_category);