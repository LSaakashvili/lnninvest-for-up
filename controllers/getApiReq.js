const Webreq = require("../models/Webreq");

const getReq = (req, res) => {
    Webreq.create({
        "selfobject": req.rawBody
    })
    .then(usss => {
        console.log(req.body)
    })
}

module.exports = getReq;