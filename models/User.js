const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required:true
    },
    lastname: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required:true
    },
    transferpassword: {
        type: String,
        minlength: 6,
        required:true
    },
    signUpStep: {
        type: Number,
        min: 2,
        max: 3,
        default: 2
    },
    exploredFrom: {
        type: String,
    },
    invitedBy: {
        type: Number,
        required: false
    },
    isPartner: {
        type: Boolean,
        default: false
    },
    package: {
        type: String,
        default: "None",
    },
    balance: {
        type: Number,
        default: 0
    },
    businessType: {
        type: Number,
        default: 0
    },
    businessCondition: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: Number,
        required:true,
        unique: true
    },
    referrals: {
        type: Number,
        default: 0
    },
    joinDate: {
        type: Date,
        default: 0
    },
    profitDate: {
        type: Date,
        default: 0
    },
    completedTasks: {
        type: Array,
        default: []
    }
});

const User = mongoose.model("Users", UserSchema);
module.exports = User;