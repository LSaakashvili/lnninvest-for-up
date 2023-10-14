const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Webreq = new Schema({
    selfobject: {
        type: Object
    }
});

const LiveData = mongoose.model("webreq", Webreq);
module.exports = LiveData;