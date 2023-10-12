const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransferSchema = new Schema({
    transferid: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    requestedBy: {
        type: String,
        required: true
    },
    coin: {
        type: String,
        default: "USDT"
    },
    status: {
        type: Number,
        default: 1
    }
});

const Transfer = mongoose.model("Transfers", TransferSchema);
module.exports = Transfer;