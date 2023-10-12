const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LiveDataSchema = new Schema({
    investors: {
        type: Number,
        default: 14811
    },
    budget: {
        type: Number,
        default: 754051
    },
    out: {
        type: Number,
        default: 380771
    }
});

const LiveData = mongoose.model("FinanceData", LiveDataSchema);
module.exports = LiveData;