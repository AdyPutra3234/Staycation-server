const mongoose = require('mongoose');

const feature_category = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    imageUrl: {
        type: String,
    }
});

module.exports = mongoose.model('feature_category', feature_category);