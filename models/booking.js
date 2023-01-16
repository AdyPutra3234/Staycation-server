const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const booking = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    invoice: {
        type: Number,
        required: true,
    },
    itemId: {
        _id: {
            type: ObjectId,
            ref: 'item',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    total: {
        type: Number,
        required: true,
    },
    memberId: {
        type: ObjectId,
        ref: 'member',
    },
    bankId: {
        type: ObjectId,
        ref: 'bank',
    },
    payments: {
        proofOfPayment: {
            type: String,
            require: true,
        },
        bankFrom: {
            type: String,
            required: true,
        },
        accountHolder: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    }
});

module.exports = mongoose.model('booking', booking);