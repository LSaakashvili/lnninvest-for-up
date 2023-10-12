const jwt = require("jsonwebtoken");
const Contact = require("../models/Contact");

const addContactRequest = (req, res) => {
    const subject = req.body.subject;
    const msg = req.body.msg;
    const email =  req.body.email;

    if (!subject || !email) {
        return res.status(400).json({
            status: "error",
            msg: "Please provide data correctly"
        })
    }

    Contact.create({
        email: email,
        subject: subject,
        msg: msg
    })
    .then(contactReq => {
        return res.json({
            "status": "success",
            "msg": "Your request has been successfully received, our support will contact you via email ."
        })
    })
}

module.exports = addContactRequest;