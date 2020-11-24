const Valuation = require("../models/Valuation");
const ValuationTemplate = require("../models/ValuationTemplate");
const { Task } = require("../models/Task");
const { JWTauth } = require("../middlewares/jwt");
const { body, validationResult } = require('express-validator');

exports.valuationList = [
    JWTauth,
    function (req, res) {
        Valuation.find()
            .then((valuations) => {
                res.status(201).json(valuations);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];
// JSON body example to create a new valuation
// {
// "valuationTemplateId" : "5fb220f75b2afdab1dd71af8",
// "varietyName" : "Oma Elsas Rimbacher Bohne",
// "userId" : "5fb289d356de431885284720"
// }
exports.valuationCreate = [
    JWTauth,
    
    // Sanitize fields.
    body("*").not()
    .isEmpty()
    .escape(),
    
    function (req, res) {
        if (!req.body.valuationTemplateId) {
            const message = "Missing ValuationTemplate Id in request body";
            res.status(400).send(message);
        }
                
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        ValuationTemplate.findById(req.body.valuationTemplateId)
            .then((template) => {
                console.log(template);
                const tasks = template.TaskDetails.map((taskdetail) => {
                    return new Task({
                        Status: "open",
                        Value: null,
                        TaskDetail: taskdetail,
                    });
                });
                const newValuation = new Valuation({
                    Status: "open",
                    ValuationTemplate: req.body.valuationTemplateId,
                    VarietyName: req.body.varietyName,
                    Year: new Date().getFullYear(),
                    User: req.body.userId,
                    Tasks: tasks,
                });
                newValuation
                    .save()
                    .then((valuation) => {
                        res.status(201).json(valuation);
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send("Error: " + err);
                    });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

// JSON body example to update a valuation
// {
//      "status" : "open",
//      "varietyName" : "Wiener Treib",
// }

exports.valuationUpdate = [
    JWTauth,
    function (req, res) {
        Valuation.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    Status: req.body.status,
                    VarietyName: req.body.varietyName,
                },
            },
            { new: true }
        )
            .then((updatedValuation) => {
                if (updatedValuation) {
                    res.status(201).json(updatedValuation);
                } else {
                    res.status(404).send(
                        `Valuation with id ${req.params.id} was not found.`
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

exports.valuationDetail = [
    JWTauth,
    function (req, res) {
        Valuation.findById(req.params.id)
            .then((valuation) => {
                res.status(201).json(valuation);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

exports.valuationDelete = [
    JWTauth,
    function (req, res) {
        Valuation.findByIdAndDelete(req.params.id)
            .then((valuation) => {
                res.status(201).send(
                    `Valuation with id ${req.params.id} was deleted.`
                );
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

