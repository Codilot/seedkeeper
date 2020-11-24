const Valuation = require("../models/Valuation");
const { JWTauth } = require("../middlewares/jwt");
const { body, validationResult } = require("express-validator");

exports.taskList = [
    JWTauth,
    function (req, res) {
        Valuation.findById(req.params.id)
            .then((valuation) => {
                res.status(201).json(valuation.Tasks);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error:" + error);
            });
    },
];

exports.taskDetail = [
    JWTauth,
    function (req, res) {
        Valuation.findById(req.params.id)
            .then((valuation) => {
                const task = valuation.Tasks.find(
                    (task) => task._id.toString() === req.params.task_id
                );
                return task;
            })
            .then((task) => {
                res.status(201).json(task);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error:" + error);
            });
    },
];

// JSON body example to update a task
// {
//      "status" : "open",
//      "value" : "01-01-2020"
// }
exports.taskUpdate = [
    JWTauth,

    // Sanitize fields.
    body("*").escape(),

    function (req, res) {
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        Valuation.findOneAndUpdate(
            { _id: req.params.id, "Tasks._id": req.params.task_id },
            {
                $set: {
                    "Tasks.$.Status": req.body.status,
                    "Tasks.$.Value": req.body.value,
                },
            },
            { new: true }
        )
            .then((valuation) => {
                const updatedTask = valuation.Tasks.id(req.params.task_id);
                res.status(201).json(updatedTask);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];