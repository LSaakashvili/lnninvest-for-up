const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;