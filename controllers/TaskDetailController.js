const ValuationTemplate = require("../models/ValuationTemplate");
const { JWTauth } = require("../middlewares/jwt");
const { body, validationResult } = require('express-validator');

// Task Detail request body example
// {
//     "name" : "Aussaattermin",
//     "category" : "Termine",
//     "startMonth" : 3,
//     "endMonth": 4,
//     "inputType" : "Date",
//     "inputOptions": [],
//     "valuationTemplate" : "5faea7e7c53b05827fb3ae6a"
// }
exports.taskDetailCreate = [
    JWTauth,
    
    // Sanitize fields.
    body("*").not()
    .isEmpty()
    .escape(),
    
    function (req, res) {
        if (!req.body) {
            const message = "Missing request body";
            res.status(400).send(message);
        }
        
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        const taskDetail = {
            Name: req.body.name,
            Category: req.body.category,
            StartMonth: req.body.startMonth,
            EndMonth: req.body.endMonth,
            InputType: req.body.inputType,
            InputOptions: req.body.inputOptions,
            ValuationTemplate: req.params.id,
        };
        ValuationTemplate.findByIdAndUpdate(
            req.params.id,
            {
                $push: { TaskDetails: taskDetail },
            },
            { new: true } // This line makes sure that the updated document is returned
        )
            .then((valuationTemplate) => {
                console.log(valuationTemplate);
                res.status(201).json(valuationTemplate);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    },
];

exports.taskDetailDetail = [
    JWTauth,
    function (req, res) {
        ValuationTemplate.findById(req.params.id)
            .then((template) => {
                const taskdetail = template.TaskDetails.find(
                    (taskdetail) =>
                        taskdetail._id.toString() === req.params.taskdetail_id
                );
                return taskdetail;
            })
            .then((taskdetail) => {
                res.status(201).json(taskdetail);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error:" + error);
            });
    },
];
