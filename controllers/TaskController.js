const Task = require("../models/Task");
const User = require("../models/User");

const AddTask = (req, res) => {
    const body = req.body;

    if (!body.email || !body.url || !body.type || !body.id) {
        console.log(body.email, body.url, body.type, body.id)
        return res.status(400).json({
            "status": "error",
            "msg": "Input fields Correctly!"
        });
    }

    Task.create({
        id: body.id,
        user: body.email,
        type: body.type,
        url: body.url
    })
    .then(task => {
        User.findOneAndUpdate({ email: body.email }, { $push : { completedTasks: Number(body.id) } })
        .then(user => {
            return res.json({
                "status": "success",
            })
        })
        .catch(err => {
            return res.status(400).json({
                "status": "error",
                "msg": "There's some error"
            })
        })
    })
}

module.exports = { AddTask };