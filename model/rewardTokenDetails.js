const mongoose = require('mongoose');

const rewardTokenDetails = mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
    },
    tokenId: {
        type: Number,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true,
    },
    creator: {
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
    transactionHash: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('rewardTokenDetails', rewardTokenDetails);