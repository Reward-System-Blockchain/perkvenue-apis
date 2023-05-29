const mongoose = require('mongoose');

const NFTcollectionDetails = mongoose.Schema({
    contractAddress: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    maxSupply: {
        type: Number,
        default: 0
    },
    txHash: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NFTcollectionDetails', NFTcollectionDetails);