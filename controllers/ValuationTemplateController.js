const ValuationTemplate = require("../models/ValuationTemplate");
const { JWTauth } = require("../middlewares/jwt");
const { body, validationResult } = require("express-validator");

exports.valuationTemplateList = [
    JWTauth,
    function (req, res) {
        ValuationTemplate.find()
            .then((templates) => {
                res.status(201).json(templates);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

exports.valuationTemplateDetail = [
    JWTauth,
    function (req, res) {
        ValuationTemplate.findById(req.params.id)
            .then((template) => {
                res.status(201).json(template);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error :" + error);
            });
    },
];

// {
//     "name" : "Tomaten"
// }
exports.valuationTemplateCreate = [
    JWTauth,

    // Sanitize fields.
    body("*").not().isEmpty().withMessage("Name is required.").escape(),

    function (req, res) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (!req.body) {
            const message = "Missing request body";
            res.status(400).send(message);
        }
        const newValuationTemplate = new ValuationTemplate({
            Name: req.body.name,
        });
        newValuationTemplate
            .save()
            .then((valuationTemplate) => {
                res.status(201).json(valuationTemplate);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    },
];
