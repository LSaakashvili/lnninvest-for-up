const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    id:{
        type: Number,
        required: true
    },
    user: {
        type: String,
        required:true
    },
    type: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const Task = mongoose.model("Tasks", TaskSchema);
module.exports = Task;