const mongoose = require('mongoose');

const RSnftDetails = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    tokenID: {
        type: Number,
        required: true
    },
    tokenURI: {
        type: String,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true
    },
    txHash: {
        type: String,
        required: true
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RSnftDetails', RSnftDetails);